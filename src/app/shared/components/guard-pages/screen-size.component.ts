import { Component, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-screen-size',
  template: `
    <div class="screen-size-container">
      <ion-img src="assets/sad.png"></ion-img>
      <ion-text color="medium">
        <span>Sorry, but your screen size is</span>
        <span>currently not supported...</span>
      </ion-text>
    </div>
  `,
  styles: [`
    .screen-size-container {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .screen-size-container ion-img {
      margin: 2em;
      max-width: 30%;
    }
    .screen-size-container ion-text {
      text-align: center;
      font-weight: bold;
      font-size: 1.2rem;
    }
    .screen-size-container span {
      display: block
    }
  `],
})
export class ScreenSizeComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    const { height, width } = window.screen;

    if (height < 1000 && width < 500) {
      this.store.dispatch(new Navigate([]));
    }
  }
}