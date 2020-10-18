import { Component } from '@angular/core';

import { consigliereLogo } from '@/shared/constants/avatars';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  consigliereLogo = consigliereLogo;
}
