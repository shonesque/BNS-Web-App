import { Component, Pipe, PipeTransform  } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}
}
