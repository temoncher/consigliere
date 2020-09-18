import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-container',
  template: `
    <div class="grid-content-center">
      <strong>Уже скоро!</strong>
    </div>
  `,
  styles: [`
    strong {
      font-size: 1.5rem;
    }
  `],
})
export class ExploreContainerComponent implements OnInit {
  constructor() { }

  ngOnInit() {}
}
