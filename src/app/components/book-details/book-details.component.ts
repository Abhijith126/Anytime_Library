import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { UtilService } from '../../services/util.service';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../core/auth.service';
import { Comment } from '../../entity/comment';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Issue } from '../../entity/issue';
import { User } from '../../entity/user';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {

  bookDetails;
  comments;
  user: User;
  admin = false;
  issued = false;
  liked = false;
  likeCount;
  bookLike;
  comment: Comment = {
    bookId: null, description: null, time: null, userId: null, ratings: null
  };
  issuedBook: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private utilService: UtilService,
    private fireService: FirebaseService,
    private auth: AuthService,
    private dbox: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.auth.user$.subscribe(user => {
        this.user = user;
        this.admin = user.role.admin;
        this.fireService.checkUserLiked(data.id, this.user.userId).subscribe(likes => {
          const userLikes: any = likes[0];
          if (userLikes) {
            this.likeCount = Object.keys(userLikes.userId).length;
            const usersString: string = JSON.stringify(userLikes.userId);
            if (usersString.indexOf(user.userId) > 0) {
              this.liked = true;
            } else {
              this.liked = false;
            }
          } else { this.likeCount = 0; }
        });
        this.fireService.getIssues(this.user.userId, data.id).subscribe(issueData => {
          if (issueData.length) {
            this.issued = true;
            this.issuedBook = issueData[0].id;
          }
        });
      });
      this.fireService.getBook(data.id).subscribe(bookData => this.bookDetails = bookData);
      this.fireService.getCommentsOfBook(data.id).subscribe(comments => this.comments = comments);
    });

  }

  goBack(): void {
    this.location.back();
  }

  updateBook(id: number): void {
    this.router.navigate(['/update-book', id]);
  }

  submitComments() {
    this.comment.userId = this.user.userId;
    this.comment.bookId = this.bookDetails.isbn;
    this.comment.time = new Date();
    this.updateRatings(this.comment.ratings);
    this.fireService.addComment(this.comment);
    this.comment = { description: null, ratings: null };
  }

  issueBook() {
    const content = 'Are you sure to issue this to book titled ' + this.bookDetails.title + ' under your ID?';
    const dialogRef = this.dbox.open(DialogBoxComponent, {
      data: { title: 'Issue Book', content: content, button: true }
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      if (this.user.bookcount) {
        this.user.bookcount -= 1;
        const bookIssue: Issue = {
          userId: this.user.userId,
          bookId: this.bookDetails.isbn,
          issueDate: new Date()
        };
        this.fireService.updateUser(this.user);
        this.fireService.addBookIssue(bookIssue);
        this.fireService.updateCopies(this.bookDetails.isbn, this.bookDetails.count - 1);
        this.issued = true;
        dialogRef.close();
        this.dbox.open(DialogBoxComponent, {
          data: { title: 'Success', content: 'Book has been issued', button: false }
        });
      }
      else {
        this.dbox.open(DialogBoxComponent, {
          data: { title: 'Error', content: 'You have reached maximum books issued, please return some books!', button: false }
        });
      }
    }
    );
  }

  renewBook() {
    const content = 'The Book titled ' + this.bookDetails.title + ' will be renewed for next 10 days...';
    const dialogRef = this.dbox.open(DialogBoxComponent, {
      data: { title: 'Renew Book', content: content, button: true }
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      const bookIssue: Issue = {
        userId: this.user.userId,
        bookId: this.bookDetails.isbn,
        issueDate: new Date()
      };
      bookIssue.issueDate = new Date();
      this.fireService.updateBookIssue(bookIssue, this.issuedBook);
      dialogRef.close();
      this.dbox.open(DialogBoxComponent, {
        data: { title: 'Success', content: 'Book has been Renewed for next 10 days', button: false }
      });
    });
  }

  returnBook() {
    const content = 'Your Book titled ' + this.bookDetails.title + ' will be returned...';
    const dialogRef = this.dbox.open(DialogBoxComponent, {
      data: { title: 'Return Book', content: content, button: true }
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      this.user.bookcount += 1;
      this.fireService.deleteBookIssue(this.issuedBook);
      this.fireService.updateUser(this.user);
      this.fireService.updateCopies(this.bookDetails.isbn, this.bookDetails.count + 1);
      dialogRef.close();
      this.issued = false;
      this.dbox.open(DialogBoxComponent, {
        data: { title: 'Success', content: 'Book has been Returned', button: false }
      });
    });
  }

  deleteComment(id) {
    this.fireService.deleteComment(id);
  }

  deleteBook() {
    this.fireService.checkIssuedBooks(this.bookDetails.isbn).take(1).subscribe(issuedBooks => {
      if (issuedBooks.length != 0) {
        this.dbox.open(DialogBoxComponent, {
          data: {
            title: 'Error',
            content: 'Book is issued to some user.Please return the book to delete and try again later',
            button: false
          }
        });
      } else {
        const content = 'Are you sure to delete this book with ISBN:' + this.bookDetails.isbn +
          ' titled "' + this.bookDetails.title + '"?';
        const dialogRef = this.dbox.open(DialogBoxComponent, {
          data: { title: 'Delete Book', content: content, button: true }
        });
        dialogRef.componentInstance.onAdd.subscribe(() => {
          this.fireService.deleteBook(this.bookDetails.isbn);
          dialogRef.close();
          this.dbox.open(DialogBoxComponent, {
            data: { title: 'Success', content: 'Book has been deleted', button: false }
          });
          this.router.navigate(['']);
        });
      }
    });
  }

  likeBook(liked) {
    if (!liked) {
      this.fireService.updateUserLikes(this.user.userId, this.bookDetails.isbn, true);
      this.liked = true;
    } else {
      this.fireService.updateUserLikes(this.user.userId, this.bookDetails.isbn, false);
      this.liked = false;
    }
  }

  shareBook(imageUrl) {
    this.dbox.open(DialogBoxComponent, {
      data: {
        title: 'Share',
        content: 'Share this book via social media',
        button: false,
        image: imageUrl
      }
    });
  }

  sliceString(ratings: number) {
    if (ratings > 5) {
      this.comment.ratings = 5;
    }
  }

  updateRatings(rating) {
    const rate = ((rating * 1.0 + this.bookDetails.ratings * 1.0) / 2);
    this.fireService.updateRatings(this.bookDetails.isbn, rate.toFixed(1));
  }

}
