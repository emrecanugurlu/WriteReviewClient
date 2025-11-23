import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleService} from '../../../services/article/article-service';
import {ArticleDto} from '../../../dto/article-dto';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-assigned-article-detail',
  imports: [
    MatButton
  ],
  templateUrl: './assigned-article-detail.html',
  styleUrl: './assigned-article-detail.scss'
})
export class AssignedArticleDetail {

  articleService = inject(ArticleService);
  article = signal(<ArticleDto>{})
  route = inject(ActivatedRoute)
  id = signal("");


  constructor() {
    this.route.paramMap.subscribe(param => {
      this.id.set(<string>param.get("id"));
    })

    this.articleService.getArticleWithId(this.id()).subscribe({
      next: (result) => {
        console.log(result);
        this.article.set(result);
      }
    })

  }
}
