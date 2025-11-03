import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass} from '@angular/common';
import {AuthService} from '../../services/auth/auth-service';

@Component({
  selector: 'app-top-app-bar',
  imports: [
    MatButton,
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
  authService = inject(AuthService)
}
