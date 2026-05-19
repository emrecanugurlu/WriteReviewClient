import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ExpertiseAreaWithoutUsersDto} from '../../dto/expertise-area-without-users-dto';
import {ExpertiseAreaWithUsersDto} from '../../dto/expertise-area-with-users-dto';

@Injectable({
  providedIn: 'root',
})
export class ExpertiseArea {

  http: HttpClient = inject(HttpClient);

  getAllExpertiseAreaWithoutUsers() {
    return this.http.get<ExpertiseAreaWithoutUsersDto[]>('/api/expertiseareas/withoutusers')
  }
  getAllExpertiseAreaWithUsers() {
    return this.http.get<ExpertiseAreaWithUsersDto[]>('/api/expertiseareas/withusers')
  }

  getMyExpertiseAreas() {
    return this.http.get<{ id: string; name: string }[]>('/api/expertiseareas/me');
  }
  addMyExpertiseArea(areaId: string) {
    return this.http.post<void>(`/api/expertiseareas/me/${areaId}`, {});
  }
  removeMyExpertiseArea(areaId: string) {
    return this.http.delete<void>(`/api/expertiseareas/me/${areaId}`);
  }

  assignUserToArea(areaId: string, userId: string) {
    return this.http.post<void>(`/api/expertiseareas/${areaId}/users/${userId}`, {});
  }
  removeUserFromArea(areaId: string, userId: string) {
    return this.http.delete<void>(`/api/expertiseareas/${areaId}/users/${userId}`);
  }

  addExpertiseArea(name: string) {
    return this.http.post<boolean>('/api/expertiseareas', { name });
  }

  updateExpertiseArea(id: string, name: string) {
    return this.http.put<{ id: string; name: string }>(`/api/expertiseareas/${id}`, { name });
  }

  deleteExpertiseArea(id: string) {
    return this.http.delete<{ message: string }>(`/api/expertiseareas/${id}`);
  }
}
