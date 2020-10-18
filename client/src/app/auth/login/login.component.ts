import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import * as firebase from 'firebase';
import { distinctUntilChanged } from 'rxjs/operators';

import { fadeSlide } from '@/shared/animations';
import { consigliereLogo } from '@/shared/constants/avatars';
import { AuthService } from '@/shared/services/auth.service';

import { authErrorMessages } from '../auth-error-messages';

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

  consigliereLogo = consigliereLogo;

  startingTitle = 'Напомните...';
  loadingText = 'Секундочку...';
  somethingWentWrong = 'Попробуй еще...';
  errorMessage = '';
  title = this.startingTitle;

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loginForm.statusChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(() => this.changeDetectorRef.detectChanges()); // to enable button on status change
  }

  async login(): Promise<void> {
    this.title = this.loadingText;
    this.errorMessage = '';

    if (!this.email || !this.password) throw new Error('Some inputs are missing');

    try {
      await this.authService.login(this.email.value, this.password.value);
    } catch (error) {
      if (error.code) {
        const firebaseError = error as firebase.auth.Error;
        const errorCode = firebaseError.code as keyof typeof authErrorMessages;

        this.errorMessage = authErrorMessages[errorCode] || this.somethingWentWrong;

        return;
      }

      throw error;
    } finally {
      this.changeDetectorRef.detectChanges();
    }
  }

  submitOnEnterKey({ key }: KeyboardEvent): void {
    if (key !== 'Enter') return;

    this.login();
  }
}
