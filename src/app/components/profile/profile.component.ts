import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { UtilService } from '../../services/util.service';
import { AuthService } from '../../core/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material';
import { Issue } from '../../entity/issue';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  editProfile = false;
  userDetails;
  issuedBooks;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private utilService: UtilService,
    private auth: AuthService,
    private fireService: FirebaseService,
    private dbox: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.fireService.getUserById(data.id).subscribe(user => this.userDetails = user);
      this.fireService.getIssuesByUser(data.id).subscribe(issues => this.issuedBooks = issues);
    });
  }

  updateUser() {
    this.fireService.updateUser(this.userDetails);
    this.editProfile = false;
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
      this.userDetails.bookcount += 1;
      this.fireService.updateUser(this.userDetails);
      this.fireService.deleteBookIssue(issue.id);
      this.fireService.updateCopies(issue.bookId, issue.book.count + 1);
      dialogRef.close();
      this.dbox.open(DialogBoxComponent, {
        data: { title: 'Success', content: 'Book has been Returned', button: false }
      });
    });
  }
}
