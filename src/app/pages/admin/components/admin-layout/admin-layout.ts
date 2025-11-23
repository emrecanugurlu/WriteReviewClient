import { Component } from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-admin-layout',
  imports: [
    MatSidenav,
    MatSidenavContainer,
    MatNavList,
    MatIcon,
    RouterLink,
    MatSidenavContent,
    MatToolbar,
    RouterOutlet,
    MatIconButton,
    MatButton
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {

}
