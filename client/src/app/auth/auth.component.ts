import { Component, OnInit } from '@angular/core';

import { consigliereLogo } from '@/shared/constants/avatars';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  consigliereLogo = consigliereLogo;
  constructor() { }

  ngOnInit() {}
}
