import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return (_route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (!user) {
      return router.createUrlTree(['/ingresar'], { queryParams: { returnUrl: state.url } });
    }

    if (!allowedRoles.includes(user.role)) {
      return router.createUrlTree(['/']);
    }

    return true;
  };
};
