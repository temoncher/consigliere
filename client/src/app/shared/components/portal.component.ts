import { CdkPortal, DomPortalOutlet } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-portal',
  template: `
  <ng-container *cdkPortal>
    <ng-content></ng-content>
  </ng-container>
  `,
})
export class PortalComponent implements AfterViewInit, OnDestroy {
  @Input() private selector: string;
  @ViewChild(CdkPortal) private portal: CdkPortal;
  private outlet: DomPortalOutlet;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector,
  ) {}

  ngAfterViewInit(): void {
    const target = document.querySelector(this.selector);

    if (!target) throw new Error('Target selector was not found');

    this.outlet = new DomPortalOutlet(
      target,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector,
    );

    this.outlet.attach(this.portal);
  }

  ngOnDestroy(): void {
    this.outlet.detach();
  }
}
