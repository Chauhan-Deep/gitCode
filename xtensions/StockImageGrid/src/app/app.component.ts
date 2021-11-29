import { Component } from '@angular/core';
import { Directive, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StockImageGrid';

  constructor() {
    // window.chrome.webview.addEventListener('message', (event: any) => {
    //   if ('QXPThemeColor' in event.data) {
    //     document.body.style.backgroundColor = event.data.QXPThemeColor[0].qxpTheme;
    //   }
    // });
  }
  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', 'NextPageImages');
    }
  }
}

@HostListener('document:wheel', [])
mousewheel(): void {
  if (!(document.body.clientHeight > window.innerHeight)) {
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', 'NextPageImages');
    }
  }
}

@HostListener('window:keydown',['$event'])
    onKeyPress(event: KeyboardEvent) {
    if(event.ctrlKey || event.altKey || event.metaKey) {
      event.preventDefault();
    }
  }

  MouseDownEvent(e) {
      if (e.which === 2) {
        e.preventDefault();
        return false;
      }
  }
}
