import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  nome: string = 'Utilizador';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.nome = nav?.extras?.state?.['username'] || 'Utilizador';

    // ⏳ Redireciona após 5 segundos
    
  }

  voltarManualmente(): void {
    this.router.navigate(['/landing']);
  }
}
