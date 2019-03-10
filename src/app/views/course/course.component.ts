import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas'; 
import html2pdf from 'html2pdf.js'

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courseURL: string = "https://looselipssinkcompanies.com/merck/adapt-assets/index.html";
  completedURL: string = "https://looselipssinkcompanies.com/cert/cert.php";
  imagesHostURL: string = "https://looselipssinkcompanies.com/cert/";


  constructor(private activatedRouterService: ActivatedRoute,
              private authService: AuthService, 
              private httpClient: HttpClient) { }

  ngOnInit() {
    
    let email = this.authService.emailFromLocalStorage();
    let fullName = this.authService.fullNameFromLocalStorage();
    const actorParameter = {
      "name" : fullName,
      "mbox" : "mailto:" + email
    }

    this.courseURL += "?actor=" + JSON.stringify(actorParameter);

    this.activatedRouterService.data.subscribe( data => {
      
      if(!data.completed) {
        return
      }

      this.completedURL += "?fname=" + fullName;

      let headers = new HttpHeaders();
      headers = headers.set('Accept', 'text/html, application/xhtml+xml, application/xml');

      this.httpClient
        .get(this.completedURL, { headers: headers, responseType: 'text' })
        .toPromise()
        .then(htmlResult => {

          const parser = new DOMParser();
          const parsedHTML = parser.parseFromString(htmlResult, "text/html");
          const imgs = parsedHTML.images;

          for (let i = 0; i < imgs.length; i++) {
            imgs[i].src = this.imagesHostURL + imgs[i].src.substr(imgs[i].src.lastIndexOf('/') + 1);
          }

          const serializer = new XMLSerializer();
          const htmlString = serializer.serializeToString(parsedHTML);

          this.exportPdf(htmlString);

        })
        .catch(error => console.log(error));
    });
  }

  exportPdf(htmlString: string) {

    const opt = {
      filename: 'Certificate of Completion.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      jsPDF: { 
        unit: 'mm', 
        orientation: 'landscape' }
    };

    html2pdf()
      .from(htmlString)
      .set(opt)
      .save();
  }
}
