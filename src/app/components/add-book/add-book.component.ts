import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { Book } from '../../entity/book';
import { FirebaseService } from '../../services/firebase.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  bookDetails: Book = {
    author: null, categories: null, coverUrl: null, description: null,
    isbn: null, publisher: null, ratings: null, year: null, title: null
  };
  isbn: number;
  errorMessage: string;
  bookForm;

  constructor(private utilService: UtilService,
    private fireService: FirebaseService,
    private dbox: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.bookForm = new FormGroup({
      'inputTitle': new FormControl(this.bookDetails.title, [
        Validators.required,
        Validators.minLength(5)
      ]),
    });
  }

  searchBookIsbn(isbn) {
    isbn = isbn.toString();
    this.errorMessage = null;
    if (isbn.length > 4 && isbn.length < 14) {
      this.utilService.getAPIData(isbn).subscribe(data => {
        const results = JSON.parse(JSON.stringify(data));
        if (results.totalItems === 0) {
          this.dbox.open(DialogBoxComponent, {
            data: { title: 'Error', content: 'No books with isbn: ' + isbn + ' is found. Please add Manually', button: false }
          });
          this.errorMessage = 'No books with isbn: ' + isbn + ' is found. Please add Manually';
        } else {
          results.items.forEach(book => {
            if (book.volumeInfo.industryIdentifiers[0].identifier) {
              if (book.volumeInfo.industryIdentifiers[0].identifier == this.isbn ||
                book.volumeInfo.industryIdentifiers[1].identifier == this.isbn) {
                this.bookDetails = {
                  title: (book.volumeInfo.title ? book.volumeInfo.title : ''),
                  isbn: (book.volumeInfo.industryIdentifiers[0].type == 'ISBN_13' ?
                    book.volumeInfo.industryIdentifiers[0].identifier : book.volumeInfo.industryIdentifiers[1].identifier),
                  author: (book.volumeInfo.authors ? book.volumeInfo.authors.toString() : ''),
                  categories: (book.volumeInfo.categories ? book.volumeInfo.categories.toString() : ''),
                  publisher: (book.volumeInfo.publisher ? book.volumeInfo.publisher : ''),
                  year: (book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate : ''),
                  ratings: (book.volumeInfo.averageRating ? book.volumeInfo.averageRating : ''),
                  coverUrl: (book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail : ''),
                  description: (book.volumeInfo.description ? book.volumeInfo.description : '')
                };
              }
            }
          });
        }
      });
    } else {
      this.dbox.open(DialogBoxComponent, {
        data: { title: 'Error', content: 'ISBN number ranges from 5-13 numbers. Please enter proper ISBN', button: false }
      });
      this.errorMessage = 'ISBN number ranges from 5-13 numbers. Please enter proper ISBN';
    }
  }

  validateBook() {
    this.errorMessage = null;
    if (this.bookDetails.isbn && this.bookDetails.title && this.bookDetails.author && this.bookDetails.categories &&
      this.bookDetails.publisher && this.bookDetails.year && this.bookDetails.ratings && this.bookDetails.count &&
      this.bookDetails.coverUrl && this.bookDetails.description && this.bookDetails.location) {
      this.addBook();
    } else {
      this.dbox.open(DialogBoxComponent, {
        data: { title: 'Error', content: 'Please enter data to all fields...', button: false }
      });
      this.errorMessage = 'Please enter data to all fields...';
    }
  }

  sliceString(ratings: number) {
    if (ratings > 5) {
      this.bookDetails.ratings = 5;
    }
  }

  addBook() {
    this.errorMessage = null;
    this.fireService.getBook(this.bookDetails.isbn).take(1).subscribe(data => {
      if (null != data) {
        this.dbox.open(DialogBoxComponent, {
          data: { title: 'Error', content: 'Book is already present. Select Edit book to modify the details', button: false }
        });
        this.errorMessage = 'Book is already present. Select Edit book to modify the details';
      } else {
        this.fireService.addBook(this.bookDetails);
        this.dbox.open(DialogBoxComponent, {
          data: { title: 'Success', content: 'Book has been Added to Database', button: false }
        });
        this.bookDetails = {
          author: null, categories: null, coverUrl: null, description: null,
          isbn: null, publisher: null, ratings: null, year: null, title: null
        };
      }
    });
  }

}
