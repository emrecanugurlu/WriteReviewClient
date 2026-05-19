import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth-service';
import { ExpertiseArea } from '../../../../services/expertise-area/expertise-area';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { ExpertiseAreaWithoutUsersDto } from '../../../../dto/expertise-area-without-users-dto';

@Component({
  selector: 'app-expert-profile',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MatSnackBarModule],
  templateUrl: './expert-profile.html',
  styleUrl: './expert-profile.scss',
})
export class ExpertProfile implements OnInit {
  isEditing = signal(false);
  showLogoutDialog = signal(false);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  formBuilder = inject(FormBuilder);
  route = inject(Router);
  authService = inject(AuthService);
  expertiseAreaService = inject(ExpertiseArea);
  private snackbar = inject(MatSnackBar);

  user = signal({
    name: '',
    role: 'Expert',
    title: '',
    bio: '',
    reviewedCount: 0,
    pendingCount: 0,
    acceptedCount: 0,
    joinYear: new Date().getFullYear()
  });

  myAreas = signal<{ id: string; name: string }[]>([]);
  allAreas = signal<ExpertiseAreaWithoutUsersDto[]>([]);
  areaProcessing = signal<string | null>(null);

  profileForm = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    title: new FormControl(''),
    bio: new FormControl('')
  });

  ngOnInit() {
    forkJoin({
      me: this.authService.getMe(),
      myAreas: this.expertiseAreaService.getMyExpertiseAreas(),
      allAreas: this.expertiseAreaService.getAllExpertiseAreaWithoutUsers()
    }).subscribe({
      next: ({ me, myAreas, allAreas }) => {
        this.user.set({
          name: me.fullName,
          role: me.roles[0] ?? 'Expert',
          title: '',
          bio: '',
          reviewedCount: me.stats.assignedCount,
          pendingCount: me.stats.expertPendingCount,
          acceptedCount: me.stats.acceptedCount,
          joinYear: me.stats.joinYear
        });
        this.myAreas.set(myAreas);
        this.allAreas.set(allAreas);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Profil bilgileri yüklenemedi.');
        this.loading.set(false);
      }
    });
  }

  isAreaSelected(areaId: string): boolean {
    return this.myAreas().some(a => a.id === areaId);
  }

  toggleArea(area: ExpertiseAreaWithoutUsersDto) {
    if (this.areaProcessing()) return;
    this.areaProcessing.set(area.id);

    if (this.isAreaSelected(area.id)) {
      this.expertiseAreaService.removeMyExpertiseArea(area.id).subscribe({
        next: () => {
          this.myAreas.update(areas => areas.filter(a => a.id !== area.id));
          this.areaProcessing.set(null);
        },
        error: () => {
          this.snackbar.open('Uzmanlık alanı kaldırılamadı.', 'Kapat', { duration: 3000 });
          this.areaProcessing.set(null);
        }
      });
    } else {
      this.expertiseAreaService.addMyExpertiseArea(area.id).subscribe({
        next: () => {
          this.myAreas.update(areas => [...areas, { id: area.id, name: area.name }]);
          this.areaProcessing.set(null);
        },
        error: () => {
          this.snackbar.open('Uzmanlık alanı eklenemedi.', 'Kapat', { duration: 3000 });
          this.areaProcessing.set(null);
        }
      });
    }
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
