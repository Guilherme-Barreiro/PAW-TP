import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-manage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-manage.component.html'
})
export class UsersManageComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (res: any[]) => this.users = res,
      error: (err: any) => console.error(err)
    });
  }

  remover(id: string): void {
    this.userService.delete(id).subscribe(() => this.ngOnInit());
  }

  voltar(): void {
    this.router.navigate(['/admin']);
  }
}
