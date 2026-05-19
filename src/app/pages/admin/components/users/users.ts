import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../services/user';
import { UsersDto } from '../../../../dto/users-dto';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserRoleDialog } from './dialogs/user-role-dialog';
import { CreateUserDialog } from './dialogs/create-user-dialog';
import { EditUserDialog } from './dialogs/edit-user-dialog';
import { DeleteConfirmDialog } from '../../../../views/delete-confirm-dialog/delete-confirm-dialog';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  readonly userService = inject(User);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  readonly users = signal<UsersDto[]>([]);
  readonly loading = signal(false);
  readonly searchQuery = signal('');
  readonly openMenuUserId = signal<string | null>(null);

  filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.users();
    return this.users().filter(u =>
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.userName.toLowerCase().includes(q)
    );
  });

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
      error: () => {
        this.loading.set(false);
        this.snackbar.open('Kullanıcılar yüklenemedi.', 'Kapat', { duration: 3000 });
      }
    });
  }

  openCreateDialog() {
    const ref = this.dialog.open(CreateUserDialog, { disableClose: true });
    ref.afterClosed().subscribe(created => {
      if (created) {
        this.fetchUsers();
        this.snackbar.open('Kullanıcı oluşturuldu.', 'Tamam', { duration: 3000 });
      }
    });
  }

  openEditDialog(user: UsersDto) {
    const ref = this.dialog.open(EditUserDialog, { data: user, disableClose: true });
    ref.afterClosed().subscribe(updated => {
      if (updated) {
        this.fetchUsers();
        this.snackbar.open('Kullanıcı güncellendi.', 'Tamam', { duration: 3000 });
      }
    });
  }

  openRoleManager(user: UsersDto) {
    const ref = this.dialog.open(UserRoleDialog, {
      data: user,
      width: '450px',
      panelClass: 'modern-dialog'
    });
    ref.afterClosed().subscribe(hasChanges => {
      if (hasChanges) this.fetchUsers();
    });
  }

  openDeleteDialog(user: UsersDto) {
    const ref = this.dialog.open(DeleteConfirmDialog, {
      data: {
        label: 'Kullanıcıyı Sil',
        title: user.fullName,
        subtitle: user.email,
        successMessage: 'Kullanıcı Silindi',
        deleteFn: () => this.userService.deleteUser(user.id)
      }
    });
    ref.afterClosed().subscribe(deleted => {
      if (deleted) this.fetchUsers();
    });
  }
}
