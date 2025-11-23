import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UsersDto} from '../dto/users-dto';

@Injectable({
  providedIn: 'root'
})
export class User {

  readonly http = inject(HttpClient)

  getAllUsers(){
    return this.http.get<UsersDto[]>("/api/appusers");
  }
}
