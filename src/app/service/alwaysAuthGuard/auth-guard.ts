import { CanActivate ,Router } from "@angular/router";
import { Injectable, Inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Injectable()
export class AuthGuard  implements CanActivate {
    isSuccess: boolean;
    constructor(private authService:AuthService,
      @Inject(SESSION_STORAGE) private storage: WebStorageService, public router: Router) { }
    canActivate() {
      this.isSuccess = localStorage.getItem('loggedIn') === 'true' ? true : false;
      // this.isSuccess = this.authService.getState();
      if(this.isSuccess === false){
        console.log(this.isSuccess)
        this.router.navigate(['signin']);
      }
      return this.isSuccess;
    }

}
