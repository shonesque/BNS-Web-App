import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { debug } from 'util';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) { }

  canActivate() {
    if (this.authService.isLoggedIn() || this.authService.emailFromLocalStorage()) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }

}
