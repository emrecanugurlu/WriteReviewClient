import {Component, inject} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass} from '@angular/common';
import {AuthService} from '../../services/auth/auth-service';
import {ThemeService} from '../../services/theme/theme-service';

@Component({
  selector: 'app-top-app-bar',
  imports: [
    MatButton,
    MatIconButton,
    MatIcon,
    MatToolbar,
    RouterLink,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './top-app-bar.html',
  styleUrl: './top-app-bar.scss'
})
export class TopAppBar {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
}
