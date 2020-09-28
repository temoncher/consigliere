import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

import { fadeSlide } from '@/shared/animations';

import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeSlide],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],
    password: [
      '',
      [Validators.required],
    ],
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loginForm.statusChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(this.changeDetectorRef.detectChanges); // to enable button on status change
  }

  async login() {
    await this.authService.login(this.email.value, this.password.value);
  }

  submitOnEnterKey({ key }: KeyboardEvent) {
    if (key !== 'Enter') return;

    this.login();
  }
}
