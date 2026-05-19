import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MatSnackBarModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  isEditing = signal(false);
  showLogoutDialog = signal(false);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  formBuilder = inject(FormBuilder);
  route = inject(Router);
  authService = inject(AuthService);
  private snackbar = inject(MatSnackBar);

  user = signal({
    name: '',
    role: '',
    title: '',
    bio: '',
    articleCount: 0,
    approvedCount: 0,
    pendingCount: 0,
    joinYear: new Date().getFullYear()
  });

  profileForm = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    title: new FormControl(''),
    bio: new FormControl('')
  });

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (data) => {
        this.user.set({
          name: data.fullName,
          role: data.roles[0] ?? '',
          title: '',
          bio: '',
          articleCount: data.stats.articleCount,
          approvedCount: data.stats.approvedCount,
          pendingCount: data.stats.pendingCount,
          joinYear: data.stats.joinYear
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Profil bilgileri yüklenemedi.');
        this.loading.set(false);
      }
    });
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
    if (this.isEditing()) {
      this.profileForm.patchValue({ name: this.user().name, title: this.user().title, bio: this.user().bio });
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.saving.set(true);
    const fullName = this.profileForm.value.name!;

    this.authService.updateMe(fullName).subscribe({
      next: (res) => {
        this.user.update(u => ({
          ...u,
          name: res.fullName,
          title: this.profileForm.value.title ?? u.title,
          bio: this.profileForm.value.bio ?? u.bio
        }));
        this.saving.set(false);
        this.isEditing.set(false);
        this.error.set(null);
        this.snackbar.open('Profil güncellendi.', 'Tamam', { duration: 3000 });
      },
      error: () => {
        this.saving.set(false);
        this.snackbar.open('Güncelleme başarısız.', 'Kapat', { duration: 3000 });
      }
    });
  }

  confirmLogout() { this.showLogoutDialog.set(true); }
  cancelLogout() { this.showLogoutDialog.set(false); }

  logout() {
    this.showLogoutDialog.set(false);
    this.authService.logout();
    this.route.navigate(['/login']);
  }
}
