import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface RoleDto {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = `/api/roles`;

  getRoles(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(this.apiUrl);
  }

  getRoleDetail(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRole(name: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { name });
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
