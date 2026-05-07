import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../services/user';
import { UsersDto } from '../../../../dto/users-dto';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserRoleDialog } from './dialogs/user-role-dialog';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatDialogModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  readonly userService = inject(User);
  private dialog = inject(MatDialog);
  
  readonly users = signal<UsersDto[]>([]);
  readonly loading = signal(false);

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: error => {
        console.error(error);
        this.loading.set(false);
      }
    });
  }

  openRoleManager(user: UsersDto) {
    const dialogRef = this.dialog.open(UserRoleDialog, {
      data: user,
      width: '450px',
      panelClass: 'modern-dialog'
    });

    dialogRef.afterClosed().subscribe(hasChanges => {
      if (hasChanges) {
        this.fetchUsers();
      }
    });
  }
}
