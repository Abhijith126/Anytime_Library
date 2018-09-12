import { Component, OnInit, Output, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { User } from '../../entity/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authenticated = false;
  admin = false;
  user: User;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.authenticated = this.authService.authenticated;
      if (user) {
        this.user = user;
        this.admin = user.role.admin;
      }
    });
  }

  login() {
    this.authService.googleLogin();
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['']);
  }
}
