import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../services/auth/auth-service';
import {Router} from '@angular/router';
import {routes} from '../../app.routes';

@Component({
  selector: 'app-profile',
  imports: [
    MatButton
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  auth_service = inject(AuthService);
  router = inject(Router);
  userRole : string| null = null;

  constructor() {
    this.userRole  = this.auth_service.getUserRole()
  }

  logout(): void {
    this.auth_service.logout();
    this.router.navigate(['login']).then(r => {});
  }

}
