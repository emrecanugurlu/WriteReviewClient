import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth-service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-profile',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MatSnackBarModule],
  templateUrl: './admin-profile.html',
})
export class AdminProfile implements OnInit {
  isEditing = signal(false);
  showLogoutDialog = signal(false);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  private snackbar = inject(MatSnackBar);

  user = signal({
    name: '',
    email: '',
    role: 'Admin',
    joinYear: new Date().getFullYear(),
  });

  profileForm = this.fb.group({
    name: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (data) => {
        this.user.set({
          name: data.fullName,
          email: data.email,
          role: data.roles[0] ?? 'Admin',
          joinYear: data.stats.joinYear,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Profil bilgileri yüklenemedi.');
        this.loading.set(false);
      },
    });
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
    if (this.isEditing()) {
      this.profileForm.patchValue({ name: this.user().name });
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.saving.set(true);
    this.authService.updateMe(this.profileForm.value.name!).subscribe({
      next: (res) => {
        this.user.update(u => ({ ...u, name: res.fullName }));
        this.saving.set(false);
        this.isEditing.set(false);
        this.snackbar.open('Profil güncellendi.', 'Tamam', { duration: 3000 });
      },
      error: () => {
        this.saving.set(false);
        this.snackbar.open('Güncelleme başarısız.', 'Kapat', { duration: 3000 });
      },
    });
  }

  confirmLogout() { this.showLogoutDialog.set(true); }
  cancelLogout() { this.showLogoutDialog.set(false); }

  logout() {
    this.showLogoutDialog.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
