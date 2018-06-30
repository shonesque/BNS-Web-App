import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { last } from '@angular/router/src/utils/collection';
import {actionCodeSettings} from "../../environments/environment";

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(public firebaseAuth: AngularFireAuth, private router: Router) {
      this.user = firebaseAuth.authState;

      // this.user.subscribe(
      //   (user) => {
      //     if (user) {
      //       this.userDetails = user;
      //       console.log(this.userDetails);
      //     } else {
      //       this.userDetails = null;
      //     }
      //   }
      // );
  }


  signUp(firstName: string, lastName:string, email: string, password: string){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(
      error => console.log('Error on creating user')
    )
  }

  signInWithTwitter() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    )
  }


  signInWithFacebook() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    )
  }

  signInWithGoogle() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  signInWithGithub() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()
    )
  }
  
  sendEmailLink(email: string) {
    
    
  }

  signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential( email, password );

    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }


  isLoggedIn() {
  if (this.userDetails == null ) {
      return false;
    } else {
      return true;
    }
  }


  logout() {
    this.firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['/']));
  }
}
