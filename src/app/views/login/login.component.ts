import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';
import { CompanyService } from '../../services/company/company.service';


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
              private router: Router,
              private usersService: UserService, 
              private companiesService: CompanyService) { }
  
  ngOnInit() {
    const url = this.router.url;
    this.confirmSignIn(url);
  }
  
  sendEmailLink() {
    
    this.errorMessage = "";

    if (!this.email) {
      this.errorMessage = "Please enter a valid email address.";
      return;
    }

    if (!this.fullName) {
      this.errorMessage = "Please enter your full name.";
      return;
    }

    this.email = this.email.toLowerCase();

    this.authService
      .sendEmailLink(this.email, this.fullName)
      .then(
        (success: boolean) => {
          this.emailSent = success;
        })
      .catch(
        (errorMessage) => {
          this.errorMessage = errorMessage
        });
  }
  
  confirmSignIn(url) {
    
    //  Check if it's from the correct URL.
    if (!this.authService.isSignedInWithTheCorrectURL(url)) {
      return;
    }
    
    let fullName = this.authService.fullNameFromLocalStorage();
    let email = this.authService.emailFromLocalStorage();
    //  Check if there is an email in local storage,
    //  a.k.a. check if the user authenticated from the same browser.
    // If missing email, prompt user for it
    if (!email) {
      email = window.prompt('Please provide your email for confirmation').toLowerCase();
    }
    
    //  Try to sign in
    this.authService
      .signIn(email, url)
      .then((userCredential) => {
        this.linkConfirmed = true;
        
        this.companiesService
        .increaseNumberOfUsedLicensesFor(email)
        .then( () => {
          
          //  If the user is new
          //  update his name
          this.authService
          .updateDisplayName(fullName)
          .then(() => {
            
              //  Check if the user is new.
              if (!userCredential.additionalUserInfo.isNewUser) {
                //  If the user is not new, don't do anything.
                return;
              }

              //  Create a new user object into DB
              let newUser = new User(userCredential.user.displayName, userCredential.user.email);
              this.usersService
                .createUser(newUser)
                .catch( message => {
                    this.errorMessage = message;
                });
            }
          );
        })
        .catch( error => {
          this.linkConfirmed = false;
          this.errorMessage = error;
        });        
      })
      .catch(() => {
        this.errorMessage = "The link maybe was malformed or expired. Please get a new sign in link." ;
      });
    
  }
  
  startCourse() {
  
    //  TODO: Update the user display name.
    //  TODO: Launch URL.

    this.router.navigate(['/course'])
    .then( () => {
      this.clear();
    });
  }
  
  logout() {
    this.authService.logout();
    this.clear();
  }

  clear() {

    this.linkConfirmed = false;
    this.emailSent = false;
    this.fullName = "";
    this.email = "";
  }
}
