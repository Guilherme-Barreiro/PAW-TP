import { Routes } from '@angular/router';
import { adminGuard } from './services/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'restaurant-manage',
    loadComponent: () =>
      import('./pages/restaurant-manage/restaurant-manage.component').then(m => m.RestaurantManageComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'users-manage',
    loadComponent: () =>
      import('./pages/users-manage/users-manage.component').then(m => m.UsersManageComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [adminGuard]
  }
];
