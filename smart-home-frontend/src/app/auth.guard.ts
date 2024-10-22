import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './services/user.service'; // Adjust the import path as needed
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.currentUser$.pipe(
      tap((user) => {
        if (!user) {
          // If there is no user, navigate to the login page
          console.log('Access denied - user not logged in');
          this.router.navigate(['/login']);
        }
      }),
      map((user) => !!user) // Return true if the user exists, false otherwise
    );
  }
}
