import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {Observable} from "rxjs";
import {actionCodeSettings} from "../../../environments/environment";
import {AngularFireAuth} from "angularfire2/auth";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  user: Observable<any>;
  email: string;
  firstName: string;
  lastName: string;
  emailSent = false;
  
  errorMessage: string;

  constructor(private firebaseAuth: AngularFireAuth,
              // private authService: AuthService,
              private router: Router) { }
  
  ngOnInit() {
    this.user = this.firebaseAuth.authState;
    const url = this.router.url;
  
    console.log("to: ", this.email);
    console.log("user: ", this.user);
    
    this.confirmSignIn(url);
  }
  
  async sendEmailLink() {
    
    console.log("send email link");
  
    try {
      console.log("to: ", this.email);
      await this.firebaseAuth.auth.sendSignInLinkToEmail(
        this.email,
        actionCodeSettings
      );
    
      window.localStorage.setItem('emailForSignIn', this.email);
      this.emailSent = true;
  
      console.log("Done: ", this.emailSent);
      this.errorMessage = "";
      
    } catch (error) {
      this.errorMessage = error.message;
  
      console.log("Nope: ", this.errorMessage);
    }
  }
    
  async confirmSignIn(url) {
    
    try {
    
      console.log("url: ", url);
      
      if (this.firebaseAuth.auth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSignIn');
        
        // If missing email, prompt user for it
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        
  
        console.log("email: ", email);
        
        // Signin user and remove the email localStorage
        this.firebaseAuth.auth
          .signInWithEmailLink(email, url)
          .then((user) => {
            console.log("BAM");
            console.log(user);
          })
          .catch((error) => {
            console.log("NO BAM");
            console.log(error);
            this.user = null;
            this.errorMessage = error.message;
          });
        window.localStorage.removeItem('emailForSignIn');
        
      } else {
        console.log("Is not signed in with email link.");
        console.log(this.user);
        this.user = null;
      }
      
    } catch (err) {
      this.errorMessage = err.message;
    }
  }
  
  startCourse() {
    
    //  update the user on the firebase DB with his full name
    
    window.localStorage.removeItem('emailForSignIn');
  
    this.emailSent = false;
    this.email = ""
  }
  
  logout() {
    
    this.firebaseAuth.auth
      .signOut()
      .then(
        (success) => console.log(success)
      )
      .catch(
        (error) => console.log(error)
      );
    
    this.user = null;
    this.emailSent = false;
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    window.localStorage.removeItem('emailForSignIn');
  }
}
