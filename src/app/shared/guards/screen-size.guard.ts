import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // workaround for screen height, window.screen doesn't work with cypress
    const { offsetHeight: height, offsetWidth: width } = document.querySelector('body');

    if (height < 1000 && width < 500) {
      return true;
    }

    return this.router.createUrlTree(['screen-size']);
  }
}
