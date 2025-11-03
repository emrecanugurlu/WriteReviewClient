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
}
