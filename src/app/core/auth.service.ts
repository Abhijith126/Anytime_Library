import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { User } from '../entity/user';

@Injectable()
export class AuthService {

  user$: Observable<User>;
  authenticated = false;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user$ = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          this.authenticated = true;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
        this.authenticated = true;
      });
  }

  signOut() {
    this.authenticated = false;
    this.afAuth.auth.signOut();
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    userRef.valueChanges().subscribe(userData => {
      if (!userData) {
        console.log('User is not present');
        const data: User = {
          name: user.displayName,
          role: {
            subscriber: true
          },
          userId: user.uid,
          image: user.photoURL,
          bookcount: 15
        };
        return userRef.set(data, { merge: true });
      } else {
        console.log('User is present');
        return userData;
      }
    });
  }

  canRead(user: User): boolean {
    const allowed = ['admin', 'subscriber'];
    return this.checkAuthorization(user, allowed);
  }

  canModify(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) {
      return false;
    }
    for (const roleText of allowedRoles) {
      if (user.role[roleText]) {
        return true;
      }
    }
    return false;
  }
}
