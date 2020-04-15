import { trigger, transition, style, animate, state } from '@angular/animations';

export const fadeSlide = trigger('fadeSlide', [
  state('void', style({ opacity: 0, transform: 'translateY(1em)' })),
  transition(':enter, :leave', [
    animate(350),
  ])
]);
