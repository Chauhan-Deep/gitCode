import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, AfterContentInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { ScanFilesComponent } from '../scan-files/scan-files.component';
import { DynamicComponentDirective } from '../dynamic-component.directive';

@Component({
  selector: 'qrk-dynamic-container',
  templateUrl: './dynamic-container.component.html',
  styleUrls: ['./dynamic-container.component.scss']
})

export class DynamicContainerComponent implements OnInit, AfterContentInit {

  @Input() stepper: MatStepper;
  @ViewChild(DynamicComponentDirective, { static: true }) dynamicComponent: DynamicComponentDirective;

  ngOnInit() {
  }

  ngAfterContentInit() {
    const scanFilesFactory = this.resolver.resolveComponentFactory(ScanFilesComponent);
    const viewContainerRef = this.dynamicComponent.viewContainerRef;

    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(scanFilesFactory);
  }

  constructor(
    private resolver: ComponentFactoryResolver
  ) { }

}
