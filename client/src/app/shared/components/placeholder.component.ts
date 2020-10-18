import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  template: `
    <div class="explore-container">
      <ion-img [src]="image || 'assets/sad.png'"></ion-img>
      <ion-text color="medium">
        <ng-content></ng-content>
      </ion-text>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .explore-container {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .explore-container ion-img {
      margin: 2em;
      max-width: 30%;
    }
    .explore-container ion-text {
      text-align: center;
      font-weight: bold;
      font-size: 1.2rem;
    }
  `],
})
export class PlaceholderComponent {
  @Input() image: string;
}
