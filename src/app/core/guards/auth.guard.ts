// auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userType = this.authService.getUserType();

    const allowedUserTypes = route.data['allowedUserTypes'] as Array<string>;

    if (allowedUserTypes.includes(userType) && this.authService.hasToken()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
