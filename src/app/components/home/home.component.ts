import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Book } from '../../entity/book';
import { User } from '../../entity/user';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  bookData: Book[][];
  authenticated = false;
  selectValue = true;

  constructor(private fireService: FirebaseService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.authenticated = this.authService.authenticated;
      if (user) {
        this.fireService.getBooks().subscribe(books => this.bookData = books);
        this.user = user;
      }
    });
  }
}
