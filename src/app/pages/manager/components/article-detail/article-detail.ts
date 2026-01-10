import {Component, inject, OnInit, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ArticleService} from '../../../../services/article/article-service';
import {ArticleDto} from '../../../../dto/article-dto';
import SetExpertsDialog from '../../../../views/set-experts-dialog/set-experts-dialog';
import {RejectDialog} from '../../../../views/reject-dialog/reject-dialog';

@Component({
  selector: 'app-article-detail',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss'
})
export class ArticleDetail {
  articleService = inject(ArticleService);
  article = signal(<ArticleDto>{})
  private route = inject(ActivatedRoute);
  private id = signal("");
  dialog = inject(MatDialog);

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

  openAction(id: string, type: 'review' | 'approve' | 'reject' | 'revreq') {
    this.dialog.open(SetExpertsDialog, {data: {articleId: id}})
  }

  openDialog(id:string): void {
    this.dialog.open(RejectDialog, {data: {articleId: id}})
  }
}
