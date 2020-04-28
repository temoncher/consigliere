import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registerText = 'Создаем ваш аккаунт...';
  private loginText = 'Выполняем вход...';

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private firebaseAuth: AngularFireAuth,
  ) { }

  async loginWithEmail(credentials) {
    const loader = await this.loadingController.create({ message: this.loginText });

    loader.present();
    await this.firebaseAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
    await this.router.navigate(['tabs', 'table']);
    loader.dismiss();
  }
  async registerByEmail({ email, password }) {
    const loader = await this.loadingController.create({ message: this.registerText });

    loader.present();
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password);
    await this.router.navigate(['login']);
    loader.dismiss();
  }

  async logout() {
    await this.firebaseAuth.signOut();
  }
}
