import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../services/user';
import { UsersDto } from '../../../../dto/users-dto';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  readonly userService = inject(User)
  readonly users = signal<UsersDto[]>([]);

  constructor() {
    this.userService.getAllUsers().subscribe(
      {
        next: (users) => {
          console.log(users);
          this.users.set(users)
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }
}
