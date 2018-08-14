import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';



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
              private usersService: UserService) { }
  
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
      email = window.prompt('Please provide your email for confirmation');
    }
    
    //  Try to sign in
    this.authService
      .signIn(email, url)
      .then((userCredential) => {
        this.linkConfirmed = true;

        //  Check if the user is new.
        if (!userCredential.additionalUserInfo.isNewUser) {
          //  If the user is not new, don't do anything.
          return;
        }
        
        //  If the user is new
        this.authService
        //  update his name
          .updateDisplayName(fullName)
          .then(() => {
              console.log('updated his name?');

              //  Create a new user object into DB
              let newUser = new User(userCredential.user.displayName, userCredential.user.email);
              this.usersService
                .createUser(newUser)
                .then( user => {
                  console.log('BAAAm');
                  console.log(user);
                })
                .catch( message => {
                    this.errorMessage = message;
                });
            }
          );
      })
      .catch(() => {
        this.errorMessage = "The link maybe was malformed or expired. Please get a new sign in link." ;
      });
    
  }
  
  startCourse() {
  
    //  TODO: Update the user display name.
    //  TODO: Launch URL.

    // this.router
    // .navigate(['/assets/course/index.html'])
    // .then( () => {
      this.authService.removeEmailFromLocalStorage();
      this.authService.removeFullNameFromLocalStorage();

      this.emailSent = false;
      this.fullName = "";
      this.email = "";
      this.linkConfirmed = false;
    // });
  }
  
  logout() {
    
    this.authService.logout();
  
    this.linkConfirmed = false;
    
    this.emailSent = false;
    this.fullName = "";
    this.email = "";
  }
}
