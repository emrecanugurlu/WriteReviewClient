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

  assignRole(userId: string, roleName: string) {
    return this.http.post<any>(`/api/appusers/${userId}/roles`, { roleName });
  }

  removeRole(userId: string, roleName: string) {
    return this.http.delete<any>(`/api/appusers/${userId}/roles/${roleName}`);
  }
}
