import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { Book } from '../../entity/book';
import { FirebaseService } from '../../services/firebase.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent implements OnInit {
  bookDetails;
  id;

  constructor(private route: ActivatedRoute,
    private router: Router, private utilService: UtilService,
    private fireService: FirebaseService,
    private dbox: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.id = data.id;
      this.fireService.getBook(data.id).subscribe(
        bookData => this.bookDetails = bookData);
    });
  }

  sliceString(ratings: number) {
    if (ratings > 5) {
      this.bookDetails.ratings = 5;
    }
  }

  updateBook() {
    this.fireService.updateBook(this.bookDetails);
    this.dbox.open(DialogBoxComponent, {
      data: { title: 'Success', content: 'Book details are modified', button: false }
    });
    this.router.navigate(['book-details/' + this.id]);
  }
}
