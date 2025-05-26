import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
  path: 'landing',
  loadComponent: () =>
    import('./shared/restaurant/restaurant.component').then(m => m.RestaurantComponent)
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
      import('./pages/home/home.component').then(m => m.HomeComponent),
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
  path: 'admin',
  loadComponent: () =>
    import('./pages/admin/admin.component').then(m => m.AdminComponent),
  canActivate: [adminGuard]
},
{
  path: 'admin-validar',
  loadComponent: () =>
    import('./pages/validar/validar.component').then(m => m.ValidarComponent),
  canActivate: [adminGuard]
},
{
  path: 'admin-users',
  loadComponent: () =>
    import('./pages/users-manage/users-manage.component').then(m => m.UsersManageComponent),
  canActivate: [adminGuard]
},
{
  path: 'admin-dashboard',
  loadComponent: () =>
    import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  canActivate: [adminGuard]
},
{
  path: 'restaurant-create',
  loadComponent: () =>
    import('./pages/create-restaurant/create-restaurant.component').then(m => m.CreateRestaurantComponent),
  canActivate: [authGuard]
},
{
  path: 'restaurants/manage/:id',
  loadComponent: () =>
    import('./pages/restaurant-manage/restaurant-manage.component').then(m => m.RestaurantManageComponent),
  canActivate: [authGuard]
},
{
  path: 'explorar',
  loadComponent: () =>
    import('./pages/explorar/explorar.component').then(m => m.ExplorarComponent),
  canActivate: [authGuard] 
},
{
  path: 'meus-pedidos',
  loadComponent: () => import('./pages/my-order/my-order.component').then(m => m.MyOrderComponent)
},
  {
    path: '**',
    redirectTo: 'landing'
  }
];
