import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { actionCodeSettings } from "environments/environment";

import * as firebase from 'firebase';


@Injectable()
export class AuthService {
  
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  
  constructor(public firebaseAuth: AngularFireAuth,
              private router: Router) {
    
    this.firebaseAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
    this.user = firebaseAuth.authState;
    
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
        } else {
          this.userDetails = null;
        }
      }
    );
  }
  
  sendEmailLink(email: string, fullName: string): Promise<boolean> {
    
    return new Promise((resolve, reject) => {
      
      try {
        
        this.firebaseAuth.auth
          .sendSignInLinkToEmail(email, actionCodeSettings)
          .then(
            () => {
            
              let lowercaseEmail = email.toLowerCase();
              window.localStorage.setItem('emailForSignIn', lowercaseEmail);
              window.localStorage.setItem('fullName', fullName);
            
              resolve(true);
          })
          .catch(
            (error) => {
              reject(error.message);
            }
          );
        
      } catch (error) {
        reject(error.message);
      }
    });
    
  }
  
  updateDisplayName(fullName: string): any {
    
    return this.firebaseAuth.auth.currentUser.updateProfile({
      displayName: fullName,
      photoURL: null
    });
  }
  
  isSignedInWithTheCorrectURL(url: string): boolean {
    return this.firebaseAuth.auth.isSignInWithEmailLink(url);
  }
  
  signIn(email: string, url: string): Promise<firebase.auth.UserCredential> {
    
    return new Promise((resolve, reject) => {
      try {
        // Signin user
        this.firebaseAuth.auth
          .signInWithEmailLink(email, url)
          .then((user) => {
            resolve(user);
          })
          .catch((error) => {
            reject(error);
            this.user = null;
          });
      } catch (err) {
        reject(err.message);
      }
    });
  }
  
  emailFromLocalStorage(): string {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      return "";
    }

    return email.toLowerCase();
  }
  
  fullNameFromLocalStorage(): string {
    return window.localStorage.getItem('fullName');
  }

  isLoggedIn() {
    return this.userDetails != null;
  }
  
  logout() {
    debugger;

    this.removeEmailFromLocalStorage();
    this.removeFullNameFromLocalStorage();
    
    this.firebaseAuth.auth
      .signOut()
      .then((res) => {
        this.router.navigate(['/'])
        this.userDetails = null;
      }
    );
  }
  
  removeEmailFromLocalStorage() {
    window.localStorage.removeItem('emailForSignIn');
  }


  removeFullNameFromLocalStorage() {
    window.localStorage.removeItem('fullName');
  }
}
