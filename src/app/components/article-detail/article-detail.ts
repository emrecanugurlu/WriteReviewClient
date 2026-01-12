import { Component, inject} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article/article-service';

@Component({
  selector: 'app-article-detail',
  imports: [],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss'
})
export class ArticleDetail {
  private route = inject(ActivatedRoute);
  private api = inject(ArticleService);

  articleId!: string;

  staffReviews: any[] = [];
  expertReviews: any[] = [];
  loading = true;
  error = '';

  ngOnInit() {

    this.articleId = this.route.snapshot.paramMap.get('id') ?? '';

    this.api.getReviews(this.articleId).subscribe({
      next: (res) => {
        this.staffReviews = res.staff ?? [];
        this.expertReviews = res.experts ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Yorumlar alınamadı.';
        this.loading = false;
      }
    });
  }
}
