import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesktopGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // workaround for screen height, window.screen doesn't work with cypress
    const body = document.querySelector('body');

    if (!body) throw new Error('Document body not found');

    if (body.offsetHeight < 1000 && body.offsetWidth < 500) {
      return true;
    }

    return this.router.createUrlTree(['screen-size']);
  }
}
