import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material';
import { Issue } from '../../entity/issue';
import { AuthService } from '../../core/auth.service';
import { User } from '../../entity/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  issuedBooks;
  books;
  users;

  constructor(
    private fireService: FirebaseService,
    private auth: AuthService,
    private dbox: MatDialog) { }

  ngOnInit() {
    this.fireService.getAllIssuedBooks().subscribe(issues => this.issuedBooks = issues);
    this.fireService.getAllUsers().subscribe(users => this.users = users);
    this.fireService.getBooks().subscribe(books => this.books = books);
  }

  getDifference(curDate) {
    return 10 - Math.round(Math.abs(curDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }

  renewBook(issue) {
    const content = 'The Book titled ' + issue.book.title + ' will be renewed for next 10 days...';
    const dialogRef = this.dbox.open(DialogBoxComponent, {
      data: { title: 'Renew Book', content: content, button: true }
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      const bookIssue: Issue = {
        userId: issue.userId,
        bookId: issue.bookId,
        issueDate: new Date()
      };
      bookIssue.issueDate = new Date();
      this.fireService.updateBookIssue(bookIssue, issue.id);
      dialogRef.close();
      this.dbox.open(DialogBoxComponent, {
        data: { title: 'Success', content: 'Book has been Renewed for next 10 days', button: false }
      });
    });
  }

  returnBook(issue) {
    const content = 'Your Book titled ' + issue.book.title + ' will be returned...';
    const dialogRef = this.dbox.open(DialogBoxComponent, {
      data: { title: 'Return Book', content: content, button: true }
    });
    dialogRef.componentInstance.onAdd.subscribe(() => {
      issue.user.bookcount += 1;
      this.fireService.updateUser(issue.user);
      this.fireService.deleteBookIssue(issue.id);
      this.fireService.updateCopies(issue.bookId, issue.book.count + 1);
      dialogRef.close();
      this.dbox.open(DialogBoxComponent, {
        data: { title: 'Success', content: 'Book has been Returned', button: false }
      });
    });
  }

  deleteBook(book) {
    this.fireService.checkIssuedBooks(book.isbn).take(1).subscribe(issuedBooks => {
      if (issuedBooks.length != 0) {
        this.dbox.open(DialogBoxComponent, {
          data: {
            title: 'Error',
            content: 'Book is issued to some user.Please return the book to delete and try again later',
            button: false
          }
        });
      } else {
        const content = 'Are you sure to delete this book with ISBN:' + book.isbn +
          ' titled "' + book.title + '"?';
        const dialogRef = this.dbox.open(DialogBoxComponent, {
          data: { title: 'Delete Book', content: content, button: true }
        });
        dialogRef.componentInstance.onAdd.subscribe(() => {
          this.fireService.deleteBook(book.isbn);
          dialogRef.close();
          this.dbox.open(DialogBoxComponent, {
            data: { title: 'Success', content: 'Book has been deleted', button: false }
          });
        });
      }
    });
  }

  deleteUser(user) {
    this.auth.user$.take(1).subscribe(loggedUser => {
      if (user.userId == loggedUser.userId) {
        this.dbox.open(DialogBoxComponent, {
          data: {
            title: 'Error',
            content: 'Are you mad?? You cannot delete yourself',
            button: false
          }
        });
      } else {
        this.fireService.getUserIssues(user.userId).take(1).subscribe(issues => {
          let issued = false;
          if (issues.length != 0) {
            issued = true;
          }
          if (!issued) {
            const content = 'Are you sure to delete this user with id:' + user.userId +
              ' name "' + user.name + '"?';
            const dialogRef = this.dbox.open(DialogBoxComponent, {
              data: { title: 'Delete User', content: content, button: true }
            });
            dialogRef.componentInstance.onAdd.subscribe(() => {
              this.fireService.deleteUser(user.userId);
              dialogRef.close();
              this.dbox.open(DialogBoxComponent, {
                data: { title: 'Success', content: 'User has been deleted', button: false }
              });
            });
          } else {
            this.dbox.open(DialogBoxComponent, {
              data: {
                title: 'Error',
                content: 'User has issued books. Return those books and try again',
                button: false
              }
            });
          }
        });
      }
    });
  }

}
