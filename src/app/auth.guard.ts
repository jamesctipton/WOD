import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private storage: StorageService
  ) {}

  loggedIn: boolean;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ):  Observable<boolean | UrlTree> | Promise<boolean> | boolean {
      
    return this.storage.getItem('loggedIn').then((val) => {
      this.loggedIn = val;

      if (!(this.loggedIn)) {
        // console.log(this.loggedIn);
        this.router.navigate(['/']);
      }
      // console.log(this.loggedIn);
      return this.loggedIn;
    });
  }

}