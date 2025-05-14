import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { OrderComponent } from './pages/order/order.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RedirectComponent } from './pages/redirect/redirect.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'order', component: OrderComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ✅ Correção: lazy-load para componente standalone
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then(m => m.CartComponent)
  }
];

@NgModule({
  declarations: [
    RedirectComponent,
    // outros componentes
  ],
  imports: [
    // CommonModule, RouterModule, FormsModule, etc.
  ]
})
export class AppModule {}

export class AppRoutingModule {}
