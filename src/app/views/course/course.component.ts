import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { saveAs } from 'file-saver';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courseURL: string = "https://looselipssinkcompanies.com/online/assets/course/index.html";
  completedURL: string = "https://looselipssinkcompanies.com/completion.php?e=";

  constructor(private activatedRouterService: ActivatedRoute,
              private authService: AuthService, 
              private httpClient: HttpClient) { }

  ngOnInit() {

    this.activatedRouterService.data.subscribe( data => {
      if(!data.completed) {
        return
      }

      let email = this.authService.emailFromLocalStorage();
      this.completedURL = this.completedURL + email;
      
      let headers = new HttpHeaders();
      headers = headers.set('Accept', 'application/pdf');

      this.httpClient
        .get(this.completedURL, { headers: headers, responseType: 'blob' })
        .toPromise()
        .then(result => {
          var blob = new Blob([result], { type: 'application/pdf' });
          saveAs(blob, "Certificate of Completion.pdf");
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
}
