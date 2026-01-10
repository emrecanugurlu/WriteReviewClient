import {Component, inject, signal} from '@angular/core';
import {Expert} from '../../../services/expert';
import {AssignedArticlesResponse} from '../../../dto/get-assigned-articles-dto';
import {MatProgressBar} from '@angular/material/progress-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-assigned-articles',
  imports: [
    MatProgressBar
  ],
  templateUrl: './assigned-articles.html',
  styleUrl: './assigned-articles.scss'
})
export class AssignedArticles {

  assignedArticles  = signal(<AssignedArticlesResponse[]>[]);
  loading = signal(false);
  error = signal("");
  ok = signal(false);
  router = inject(Router);

  expertService = inject(Expert)
  constructor() {
    this.loading.set(true);
    this.expertService.getAssignedArticles().subscribe({
      next: (res) => {
        this.loading.set(false);
        this.ok.set(true);
        console.log(res);
        this.assignedArticles.set(res)
      },
      error: err => {
        this.error.set(err.message);
        console.log(err);
      }
      }
    )
  }

  goAssignedArticleDetail(id:string): void {
    this.router.navigate(['assigned-article-detail/' + id]).then(r=>{});
  }
}
