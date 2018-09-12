import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Book } from '../entity/book';
import { Comment } from '../entity/comment';
import { Issue } from '../entity/issue';
import { Likes } from '../entity/likes';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {
  books: AngularFirestoreCollection<Book[]>;
  comments;
  constructor(private db: AngularFirestore) { }

  getBooks() {
    this.books = this.db.collection('/books', ref => ref.orderBy('title'));
    return this.books.valueChanges();
  }

  getBook(id) {
    return this.db.doc(`/books/${id}`).valueChanges();
  }

  addBook(bookDetails) {
    const pushId = bookDetails.isbn;
    const filteredBook = JSON.parse(JSON.stringify(bookDetails));
    return this.db.collection('/books').doc(pushId).set(filteredBook);
  }

  updateBook(bookDetails) {
    const pushId = bookDetails.isbn;
    const filteredBook = JSON.parse(JSON.stringify(bookDetails));
    return this.db.collection('/books').doc(pushId).update(filteredBook);
  }

  deleteBook(id) {
    this.db.collection('/books').doc(id).delete();
  }

  getUserById(id) {
    return this.db.doc(`/users/${id}`).valueChanges();
  }

  deleteUser(id) {
    this.db.collection('/users').doc(id).delete();
  }

  getCommentsOfBook(bookId) {
    return this.comments = this.db.collection('/comments', ref => ref.where('bookId', '==', bookId).orderBy('time')).snapshotChanges()
      .map(ref => {
        return ref.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          this.db.collection('/users').doc(data.userId).valueChanges().subscribe(user => data.user = user);
          return data;
        });
      });
  }

  addComment(comment) {
    this.db.collection('/comments').add(comment);
  }

  getIssues(userId, bookId) {
    return this.db.collection('/issues', ref => ref.where('userId', '==', userId)
      .where('bookId', '==', bookId)).snapshotChanges().map(ref => {
        return ref.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return data;
        });
      });
  }

  addBookIssue(issue) {
    this.db.collection('/issues').add(issue);
  }

  updateBookIssue(issue, id) {
    this.db.collection('/issues').doc(id).update(issue);
  }

  deleteBookIssue(id) {
    this.db.collection('/issues').doc(id).delete();
  }

  deleteComment(id) {
    this.db.collection('/comments').doc(id).delete();
  }

  checkIssuedBooks(id) {
    return this.db.collection('/issues', ref => ref.where('bookId', '==', id)).valueChanges();
  }

  updateCopies(bookId, count) {
    this.db.collection('/books').doc(bookId).update({ 'count': count });
  }

  updateRatings(bookId, ratings) {
    this.db.collection('/books').doc(bookId).update({ 'ratings': ratings });
  }

  updateUser(user) {
    this.db.collection('/users').doc(user.userId).update(user);
  }

  getIssuesByUser(userId) {
    return this.db.collection('/issues', ref => ref.where('userId', '==', userId)).snapshotChanges().map(ref => {
      return ref.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        this.db.collection('/books').doc(data.bookId).valueChanges().subscribe(book => data.book = book);
        return data;
      });
    });
  }

  getUserIssues(userId) {
    return this.db.collection('/issues', ref => ref.where('userId', '==', userId)).valueChanges();
  }

  getAllIssuedBooks() {
    return this.db.collection('/issues').snapshotChanges().map(ref => {
      return ref.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        this.db.collection('/users').doc(data.userId).valueChanges().subscribe(user => data.user = user);
        this.db.collection('/books').doc(data.bookId).valueChanges().subscribe(book => data.book = book);
        return data;
      });
    });
  }

  getAllUsers() {
    return this.db.collection('/users').valueChanges();
  }

  updateUserLikes(userId, bookId, choice) {
    if (choice) {
      const likes: Likes = {
        bookId: bookId,
        userId: {
          [userId]: true
        }
      };
      this.db.collection('/likes').doc(bookId).set(likes, { merge: true });
    } else {
      this.db.collection('/likes').doc(bookId).update({
        ['userId.' + userId]: firebase.firestore.FieldValue.delete()
      });
    }
  }

  checkUserLiked(bookId, userId) {
    return this.db.collection('/likes', ref => ref.where('bookId', '==', bookId)).valueChanges();
  }

}
