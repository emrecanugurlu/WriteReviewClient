import { Component, inject } from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth-service';

@Component({
  selector: 'app-admin-layout',
  imports: [
    MatSidenav,
    MatSidenavContainer,
    MatNavList,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    MatSidenavContent,
    MatToolbar,
    RouterOutlet,
    MatIconButton,
    MatButton,
    MatMenuModule
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
