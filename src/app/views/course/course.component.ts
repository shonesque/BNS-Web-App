import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courseURL: string = "https://looselipssinkcompanies.com/online/assets/course/index.html";
  completedURL: string = "https://looselipssinkcompanies.com/completion.php?e=";

  constructor(private activatedRouterService: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {

    this.activatedRouterService.data.subscribe( data => {
      if(!data.completed) {
        return
      }

      let email = this.authService.emailFromLocalStorage();
      
      this.completedURL = this.completedURL + email;
      window.open(this.completedURL, '_blank');

      this.authService.logout();
    });
  }
}
