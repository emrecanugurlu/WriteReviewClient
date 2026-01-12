import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ArticleService } from '../../../../services/article/article-service';
import { ArticleDto } from '../../../../dto/article-dto';
import SetExpertsDialog from '../../../../views/set-experts-dialog/set-experts-dialog';
import { RejectDialog } from '../../../../views/reject-dialog/reject-dialog';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-detail',
  imports: [
    LucideAngularModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss'
})
export class ArticleDetail {

  private loading = signal(false);
  private error = signal("");
  private ok = signal(false);

  articleService = inject(ArticleService);
  article = signal(<ArticleDto>{})
  private route = inject(ActivatedRoute);
  private id = signal("");
  dialog = inject(MatDialog);


  constructor() {
    this.route.paramMap.subscribe(param => {
      this.id.set(<string>param.get("id"));
      this.fetchArticle();
    })
  }

  openAction(id: string, type: 'review' | 'approve' | 'reject' | 'revreq') {
    this.dialog.open(SetExpertsDialog, { data: { articleId: id } })
  }

  openDialog(id: string): void {
    this.dialog.open(RejectDialog, { data: { articleId: id } })
  }

  activeTab = signal<'text' | 'pdf' | 'reports'>('text'); // Yeni state

  // Pagination States

  pageSize = signal(4);





  fetchArticle() {
    this.loading.set(true);
    this.articleService.getArticleWithId(this.id()).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.ok.set(true);
        console.log(result);
        this.article.set(result);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set("Error: " + err.message);
        console.log(err);
      }
    })
  }

  openRejectDialog() {
    const dialogRef = this.dialog.open(RejectDialog, { data: { articleId: this.id() } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchArticle();
      }
    });
  }

  openAssignDialog() {
    this.dialog.open(SetExpertsDialog,
      { width: '100%', maxWidth: '56rem', maxHeight: '60rem', data: { articleId: this.id() } },
    )
  }


}
