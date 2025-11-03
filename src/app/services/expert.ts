import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddArticleExpertDTO} from '../dto/add-article-expert-dto';

@Injectable({
  providedIn: 'root'
})
export class Expert {
  http = inject(HttpClient);

  addArticleExpert(data: AddArticleExpertDTO){
    this.http.post('api/experts',{data:data},)
  }
}
