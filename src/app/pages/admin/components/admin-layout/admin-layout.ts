import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth-service';
import { ThemeService } from '../../../../services/theme/theme-service';

@Component({
  selector: 'app-admin-layout',
  imports: [
    MatSidenav,
    MatSidenavContainer,
    MatNavList,
    RouterLink,
    RouterLinkActive,
    MatSidenavContent,
    RouterOutlet
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);

  adminName = signal('Admin');

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (me) => this.adminName.set(me.fullName),
      error: () => {}
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
