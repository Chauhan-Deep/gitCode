import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[qrkDynamicComponent]'
})
export class DynamicComponentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}
