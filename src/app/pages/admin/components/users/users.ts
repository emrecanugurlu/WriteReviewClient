import {Component, inject, signal} from '@angular/core';
import {User} from '../../../../services/user';
import {UsersDto} from '../../../../dto/users-dto';


@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  readonly userService = inject(User)
  readonly users = signal([<UsersDto>{}]);

  constructor() {
    this.userService.getAllUsers().subscribe(
      {
        next: (users) => {
          console.log(users);
          this.users.set(users)
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }

}
