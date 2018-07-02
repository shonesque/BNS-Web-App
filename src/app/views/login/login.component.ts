import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  email: string;
  fullName: string;
  emailSent = false;
  errorMessage: string;
  
  linkConfirmed = false;
  
  constructor(private authService: AuthService,
              private router: Router) { }
  
  ngOnInit() {
    
    const url = this.router.url;
    console.log("init email: ", this.email);
    
    this.confirmSignIn(url);
  }
  
  sendEmailLink() {
    
    this.errorMessage = "";
    
    this.authService
      .sendEmailLink(this.email, this.fullName)
      .then(
        (success: boolean) => {
          console.log(success);
          this.emailSent = success;
        })
      .catch(
        (errorMessage) => {
          console.log(errorMessage);
          this.errorMessage = errorMessage
        });
  }
  
  confirmSignIn(url) {
    
    console.log("url: ", url);
    
    if (!this.authService.isSignedInWithTheCorrectURL(url)) {
      return;
    }
    
    let email = this.authService.emailFromLocalStorage();
    // If missing email, prompt user for it
    if (!email) {
      email = window.prompt('Please provide your email for confirmation');
    }
    
    console.log("Provided email: ", email);
    
    this.authService
      .signIn(email, url)
      .then((user) => {
        console.log('Bam!');
        this.linkConfirmed = true;
        console.log(user);
      })
      .catch(() => {
        this.errorMessage = "The link maybe was malformed or expired. Please get a new sign in link." ;
      });
    
  }
  
  startCourse() {
    
    this.authService.updateDisplayName(this.fullName);
    
    this.authService.removeEmailFromLocalStorage();
    this.emailSent = false;
    this.fullName = "";
    this.email = "";
    this.linkConfirmed = false;
  }
  
  logout() {
    
    this.authService.logout();
  
    this.linkConfirmed = false;
    
    this.emailSent = false;
    this.fullName = "";
    this.email = "";
  }
}
