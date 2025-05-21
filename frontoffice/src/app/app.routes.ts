import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
  path: 'home',
  loadComponent: () =>
    import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  canActivate: [authGuard]
},

  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu/menu.component').then(m => m.MenuComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'order',
    loadComponent: () =>
      import('./pages/order/order.component').then(m => m.OrderComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
  path: 'dish/:id',
  loadComponent: () =>
    import('./pages/details/details.component').then(m => m.DetailsComponent)
  },
  {
  path: 'menu/add',
  loadComponent: () =>
    import('./pages/menuAddDish/menuAddDish.component').then(m => m.MenuAddDishComponent),
  canActivate: [authGuard]
  },
  {
  path: 'logout',
  loadComponent: () =>
    import('./pages/logout/logout.component').then(m => m.LogoutComponent)
  },
  {
    path: '**',
    redirectTo: 'landing'
  }
];
