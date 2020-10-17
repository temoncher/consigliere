import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

import { fadeSlide } from '@/shared/animations';
import { consigliereLogo } from '@/shared/constants/avatars';

import { AuthService } from '../../shared/services/auth.service';
import { authErrorMessages } from '../auth-error-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fadeSlide],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = this.formBuilder.group({
    nickname: [
      '',
      [
        Validators.required,
        Validators.maxLength(24),
        Validators.minLength(2),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.maxLength(24),
        Validators.minLength(6),
      ],
    ],
  });

  consigliereLogo = consigliereLogo;

  startingTitle = 'Добро пожаловать!';
  loadingText = 'Секундочку...';
  somethingWentWrong = 'Попробуй еще...';
  errorMessage = '';
  title = this.startingTitle;

  get nickname() {
    return this.registerForm.get('nickname');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.registerForm.statusChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(() => this.changeDetectorRef.detectChanges()); // to enable button on status change
  }

  async register() {
    if (this.registerForm.invalid) return;

    try {
      await this.authService.register(this.email.value, this.password.value, this.nickname.value);
    } catch (error) {
      if (error.code) {
        const firebaseError = error as firebase.auth.Error;

        this.errorMessage = authErrorMessages[firebaseError.code] || this.somethingWentWrong;

        return;
      }

      throw error;
    } finally {
      this.title = this.startingTitle;
      this.changeDetectorRef.detectChanges();
    }
  }

  submitOnEnterKey({ key }: KeyboardEvent) {
    if (key !== 'Enter') return;

    this.register();
  }
}
