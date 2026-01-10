import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ArticleService} from '../../services/article/article-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-new-article',
  imports: [
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: './new-article.html',
  styleUrl: './new-article.scss'
})
export default class NewArticle {

  private _snackbar = inject(MatSnackBar)
  loading  = signal(false);
  ok =signal(false);
  error = '';

  fb = inject(FormBuilder);
  private articleApi = inject(ArticleService);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    summary: ['', [Validators.required, Validators.maxLength(400)]],
    content: ['', [Validators.required, Validators.minLength(50)]],
    categoryId: [null as string | null, Validators.required],
    tags: ['']
  });

  categories = [
    {id: 'cat-arch', name: 'Mimari'},
    {id: 'cat-web', name: 'Web'},
    {id: 'cat-db', name: 'Veri Tabanı'},
  ];

  wordCount = 0;
  coverFile?: File;

  constructor() {
    this.form.get('content')!.valueChanges.subscribe(v => {
      this.wordCount = (v ?? '').trim().split(/\s+/).filter(x => x).length;
    });
  }

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    this.coverFile = input.files?.[0] ?? undefined;
  }

  saveArticle(isSubmit: Boolean) {
    /*
    this.ok.set(false);
    this.error = '';
    this.loading.set(true);

    const v = this.form.value;
    if (this.form.invalid || !v.title || !v.summary || !v.content || !v.categoryId) {
      this.loading.set(false);
      this.error = 'Zorunlu alanlar eksik.';
      return;
    }

    const payload = {
      title: this.form.value.title!,
      summary: this.form.value.summary!,
      content: this.form.value.content!,
    };

    this.articleApi.createArticle({articleDto:payload,isSubmit:isSubmit}).subscribe({
        next: _res => {
          this.ok.set(true);
          this.loading.set(false);
          this._snackbar.open(_res.message,"Kapat",{
            duration: 5000,
          })
          },
        error: err => { this.error = 'Kaydetme sırasında hata oluştu.'; this.loading.set(false); console.error(err); }
    })
*/
  }

  private parseTags(raw: string): string[] {
    return (raw ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

}

