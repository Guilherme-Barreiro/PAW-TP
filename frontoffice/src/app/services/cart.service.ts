import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  tipo: 'meia' | 'inteira';
  restaurantId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private auth: AuthService) {
    const userId = this.auth.getUserId();
    if (typeof window !== 'undefined' && userId) {
      const saved = localStorage.getItem(this.getCartKey(userId));
      if (saved) {
        this.cartItems = JSON.parse(saved);
        this.cartSubject.next(this.cartItems);
      }
    }
  }

  private getCartKey(userId: string): string {
    return `cart_${userId}`;
  }

  private getStartTimeKey(userId: string): string {
    return `cart_start_${userId}`;
  }

  private getUserId(): string | null {
    return this.auth.getUserId();
  }

  private updateCart() {
    const userId = this.getUserId();
    if (userId) {
      localStorage.setItem(this.getCartKey(userId), JSON.stringify(this.cartItems));
      this.cartSubject.next(this.cartItems);
    }
  }

  getStartTime(): number | null {
    const userId = this.getUserId();
    if (!userId) return null;
    const time = localStorage.getItem(this.getStartTimeKey(userId));
    return time ? +time : null;
  }

  addItem(item: CartItem) {
    if (
      this.cartItems.length > 0 &&
      this.cartItems[0].restaurantId !== item.restaurantId
    ) {
      if (!confirm('O carrinho já contém pratos de outro restaurante. Desejas limpar o carrinho para adicionar este novo prato?')) {
        return;
      }
      this.clearCart();
    }

    const index = this.cartItems.findIndex(
      i => i.dishId === item.dishId && i.tipo === item.tipo
    );
    if (index > -1) {
      this.cartItems[index].quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }

    const userId = this.getUserId();
    if (userId) {
      localStorage.setItem(this.getStartTimeKey(userId), Date.now().toString());
    }

    this.updateCart();
  }

  updateItem(dishId: string, quantity: number, tipo: 'meia' | 'inteira'): void {
    const index = this.cartItems.findIndex(i => i.dishId === dishId && i.tipo === tipo);
    if (index > -1) {
      this.cartItems[index].quantity = quantity;
      this.updateCart();
    }
  }

  removeItem(dishId: string, tipo: 'meia' | 'inteira') {
    this.cartItems = this.cartItems.filter(i => !(i.dishId === dishId && i.tipo === tipo));
    this.updateCart();
  }

  clearCart() {
    const userId = this.getUserId();
    this.cartItems = [];
    if (userId) {
      localStorage.removeItem(this.getCartKey(userId));
      localStorage.removeItem(this.getStartTimeKey(userId));
    }
    this.cartSubject.next(this.cartItems);
  }

  getItems(): CartItem[] {
    return [...this.cartItems];
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}
