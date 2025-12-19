import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
isEditing = signal(false);
formBuilder = inject(FormBuilder);
route = inject(Router);
authService = inject(AuthService);

  user = signal({
    name: 'Ahmet Yılmaz',
    role: 'Yazar', 
    title: 'Teknoloji Editörü',
    bio: 'Yazılım mimarisi ve UX üzerine yazıyorum. Basitlik en büyük karmaşıklıktır.',
    articleCount: 42
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

  logout() {
    this.authService.logout();
    this.route.navigate(['/login']).then(() => {});
  }
}
