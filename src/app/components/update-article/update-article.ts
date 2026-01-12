import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { ArticleService } from '../../services/article/article-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ArticleDto } from '../../dto/article-dto';
import { ArticleReview } from '../../entities/interfaces/article-review';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-article',
  imports: [
    FormsModule,
    MatButton,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './update-article.html',
  styleUrl: './update-article.scss'
})
export class UpdateArticle {

  fb = inject(FormBuilder);
  loading = signal(false);
  ok = false;
  error = '';
  wordCount = 0;
  coverFile?: File;
  reviews: ArticleReview[] = [];


  protected article = signal({
    id: "",
    updatedAt: "",
    title: "",
    status: 0
  });
  private articleApi = inject(ArticleService);
  private _snackbar = inject(MatSnackBar)

  constructor(private route: ActivatedRoute) {
    this.loading.set(true);
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.articleApi.getReviews(id).subscribe({
        next: rev => { this.reviews = rev.staff; this.loading.set(false); },
        error: _ => { this.reviews = []; this.loading.set(false); },
      });

      this.articleApi.getArticleWithId(id).subscribe(article => {
        this.article.set({ ...article })
        this.loading.set(false);
        this.form = this.fb.group({
          title: [this.article().title, [Validators.required, Validators.maxLength(120)]],
          summary: [this.article().title, [Validators.required, Validators.maxLength(400)]],
          content: ['', [Validators.required, Validators.minLength(50)]],
          categoryId: [null as string | null, Validators.required],
          tags: ['']
        });
      })
    });
  }

  statusText(s: number) {
    const map: any = { 0: 'Draft', 1: 'Submitted', 2: 'InReview', 3: 'Approved', 4: 'Rejected', 5: 'RevisionsRequested' };
    return map[s] ?? s;
  }

  actionText(a: number) {
    const map: any = { 1: 'İncelemeye alındı', 2: 'Onaylandı', 3: 'Reddedildi', 4: 'Düzeltme istendi' };
    return map[a] ?? a;
  }


  form = this.fb.group({
    title: [this.article().title, [Validators.required, Validators.maxLength(120)]],
    summary: ['', [Validators.required, Validators.maxLength(400)]],
    content: ['', [Validators.required, Validators.minLength(50)]],
    categoryId: [null as string | null, Validators.required],
    tags: ['']
  });

  categories = [
    { id: 'cat-arch', name: 'Mimari' },
    { id: 'cat-web', name: 'Web' },
    { id: 'cat-db', name: 'Veri Tabanı' },
  ];

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    this.coverFile = input.files?.[0] ?? undefined;
  }


  saveDraft() {
    this.ok = false;
    this.error = '';
    this.loading.set(true);

    const v = this.form.value;
    if (this.form.invalid || !v.title || !v.summary || !v.content || !v.categoryId) {
      this.loading.set(false);
      this.error = 'Zorunlu alanlar eksik.';
      return;
    }

    const payload = {
      title: v.title!,
      summary: v.summary!,
      content: v.content!,
      categoryId: v.categoryId!,
      tags: v.tags ?? '',
    };

    this.articleApi.createArticle({ articleDto: payload, isSubmit: false }).subscribe({
      next: _res => {
        this.ok = true;
        this.loading.set(false);
        this._snackbar.open("Tasklak Kaydedildi", "Kapat", {
          duration: 5000,
        })
      },
      error: err => { this.error = 'Kaydetme sırasında hata oluştu.'; this.loading.set(false); console.error(err); }
    })

  }

}
