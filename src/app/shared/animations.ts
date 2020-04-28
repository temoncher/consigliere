import { trigger, transition, style, animate, state, useAnimation } from '@angular/animations';
import { fadeInUp } from 'ng-animate';

export const oldFadeSlide = trigger('fadeSlide', [
  state('void', style({ opacity: 0, transform: 'translateY(1em)' })),
  transition(':enter, :leave', [
    animate(350),
  ]),
]);

export const fadeSlide = trigger('fadeSlide', [
  transition(':enter, :leave', useAnimation(fadeInUp, {
    params: {
      timing: 0.35,
      a: '1em',
    },
  })),
]);
