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

  deleteUser(userId: string) {
    return this.http.delete<any>(`/api/appusers/${userId}`);
  }

  createUser(body: { fullName: string; userName: string; email: string; password: string }) {
    return this.http.post<any>('/api/appusers', body);
  }

  updateUser(userId: string, body: { fullName: string; email: string }) {
    return this.http.put<any>(`/api/appusers/${userId}`, body);
  }
}
