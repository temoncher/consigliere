import { Component } from '@angular/core';

@Component({
  selector: 'app-screen-size',
  template: `
    <app-placeholder class="h100" image="assets/sad.png">
      <span class="d-block">Простите, но ваш размер экрана</span>
      <span class="d-block">в текущий момент не поддерживается...</span>
    </app-placeholder>
  `,
})
export class ScreenSizeComponent {}
