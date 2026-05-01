import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth-service';

@Component({
  selector: 'app-manager-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './manager-profile.html',
  styleUrl: './manager-profile.scss',
})
export class ManagerProfile {
  isEditing = signal(false);
  showLogoutDialog = signal(false);
  formBuilder = inject(FormBuilder);
  route = inject(Router);
  authService = inject(AuthService);

  user = signal({
    name: 'Dr. Editör',
    role: 'Baş Editör',
    title: 'Yönetici Editör',
    bio: 'Akademik yayıncılık süreçleri ve hakem değerlendirmesi üzerine uzmanlaşmış editör. Kaliteli bilimsel içerik üretimini destekliyorum.',
    reviewedCount: 128,
    assignedCount: 34,
    pendingCount: 18,
    joinYear: 2020
  });

  profileForm = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    role: new FormControl(''),
    title: new FormControl(''),
    bio: new FormControl('')
  });

  toggleEdit() {
    this.isEditing.update(v => !v);
    if (this.isEditing()) {
      this.profileForm.patchValue({
        name: this.user().name,
        role: this.user().role,
        title: this.user().title,
        bio: this.user().bio
      });
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.user.update(u => ({
        ...u,
        name: this.profileForm.value.name!,
        role: this.profileForm.value.role!,
        title: this.profileForm.value.title!,
        bio: this.profileForm.value.bio!
      }));
      this.isEditing.set(false);
    }
  }

  confirmLogout() {
    this.showLogoutDialog.set(true);
  }

  cancelLogout() {
    this.showLogoutDialog.set(false);
  }

  logout() {
    this.showLogoutDialog.set(false);
    this.authService.logout();
    this.route.navigate(['/login']).then(() => {});
  }
}
