import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { actionCodeSettings } from "../../environments/environment";

import * as firebase from 'firebase/app'


@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  
  constructor(public firebaseAuth: AngularFireAuth,
              private router: Router) {
    
    this.user = firebaseAuth.authState;
    
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);
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
            window.localStorage.setItem('emailForSignIn', email);
            console.log("Done.");
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
  
  updateDisplayName(fullName: string) {
    console.log('Name to be updated: ', fullName);
    
    this.firebaseAuth.auth.currentUser.updateProfile({
      displayName: fullName,
      photoURL: null
    });
  }
  
  isSignedInWithTheCorrectURL(url: string): boolean {
    return this.firebaseAuth.auth.isSignInWithEmailLink(url);
  }
  
  signIn(email: string, url: string): Promise<any> {
    
    return new Promise((resolve, reject) => {
      try {
    
        // Signin user and remove the email localStorage
        this.firebaseAuth.auth
          .signInWithEmailLink(email, url)
          .then((user) => {
            resolve(user);
          })
          .catch((error) => {
            reject(error);
            this.user = null;
          });
        
        window.localStorage.removeItem('emailForSignIn');
        
    
      } catch (err) {
        reject(err.message);
      }
    });
  }
  
  emailFromLocalStorage(): string {
    return window.localStorage.getItem('emailForSignIn');
  }
  
  isLoggedIn() {
    return this.userDetails != null;
  }
  
  
  logout() {
    window.localStorage.removeItem('emailForSignIn');
    
    this.firebaseAuth.auth
      .signOut()
      .then((res) => this.router.navigate(['/']));
  }
  
  removeEmailFromLocalStorage() {
    window.localStorage.removeItem('emailForSignIn');
  }
}
