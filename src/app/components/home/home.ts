import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {TopAppBar} from '../../views/top-app-bar/top-app-bar';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    TopAppBar
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
