import { Component } from '@angular/core';
import { Directive, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ImageGrid';

  @HostListener('window:scroll', [])
  onScroll(): void {

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      window.chrome.webview.postMessage('NextPageImages');
  }
}

@HostListener('document:wheel', [])
mousewheel(): void {
  if (!(document.body.clientHeight > window.innerHeight)) {
    window.chrome.webview.postMessage('NextPageImages');
  }
}
}
