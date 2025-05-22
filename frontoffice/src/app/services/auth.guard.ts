import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // ❌ Se não estiver autenticado, vai para landing
  if (!auth.isAuthenticated()) {
    router.navigate(['/landing']);
    return false;
  }

  // ✅ Autenticado → Permite acesso
  return true;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // ❌ Se não estiver autenticado, vai para landing
  if (!auth.isAuthenticated()) {
    router.navigate(['/landing']);
    return false;
  }

  // ✅ Se for admin → permite acesso
  const role = auth.getUserRole();
  if (role === 'admin') {
    return true;
  }

  // ❌ Se for cliente ou funcionário → redireciona para home
  router.navigate(['/home']);
  return false;
};
