import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from '../components/dialog-box/dialog-box.component';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService,
    private dbox: MatDialog,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.auth.user$.pipe(
      take(1),
      map(user => user && user.role.admin ? true : false),
      tap(isAdmin => {
        if (!isAdmin) {
          this.dbox.open(DialogBoxComponent, {
            data: { title: 'Access Denied', content: 'Only admins can access this page.', button: false }
          });
          this.router.navigate(['']);
        }
      })
    );

  }
}
