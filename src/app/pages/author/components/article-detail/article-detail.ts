import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { ArticleService } from '../../../../services/article/article-service';
import { ArticleReview } from '../../../../entities/interfaces/article-review';

@Component({
    selector: 'app-article-detail',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        DatePipe,
        RouterLink
    ],
    templateUrl: './article-detail.html',
    styleUrl: './article-detail.scss'
})
export class ArticleDetail {

    fb = inject(FormBuilder);
    loading = signal(false);
    ok = false;
    error = '';
    wordCount = 0;
    reviews: ArticleReview[] = [];

    protected article = signal({
        id: "",
        updatedAt: "",
        title: "",
        status: 0,
        summary: "",
        content: "",
        category: ""
    });

    private articleApi = inject(ArticleService);
    private _snackbar = inject(MatSnackBar)

    // Define form here
    form = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(120)]],
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

    constructor(private route: ActivatedRoute, private router: Router) {
        this.loading.set(true);
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (!id) {
                this.error = "Makale ID bulunamadı.";
                this.loading.set(false);
                return;
            }

            this.articleApi.getReviews(id).subscribe({
                next: rev => {
                    // Handle different response structures if necessary, assuming {staff: [], experts: []}
                    if ('staff' in rev) {
                        this.reviews = (rev as any).staff;
                    } else {
                        this.reviews = rev as any;
                    }
                    this.loading.set(false);
                },
                error: _ => { this.reviews = []; } // Don't stop loading here, wait for article
            });

            this.articleApi.getArticleWithId(id).subscribe({
                next: article => {
                    this.article.set({ ...article })
                    this.loading.set(false);

                    // Check if editable
                    const isEditable = article.status === 0 || article.status === 5; // Draft or ReviewRequested

                    this.form.patchValue({
                        title: article.title,
                        summary: article.summary,
                        content: article.content,
                        categoryId: article.category,
                        tags: '' // Tags handling if available
                    });

                    if (!isEditable) {
                        this.form.disable();
                    } else {
                        this.form.enable();
                    }

                    this.wordCount = article.content ? article.content.split(/\s+/).length : 0;

                    this.form.get('content')?.valueChanges.subscribe(val => {
                        this.wordCount = val ? val.split(/\s+/).length : 0;
                    });
                },
                error: err => {
                    this.error = "Makale yüklenemedi.";
                    this.loading.set(false);
                }
            })
        });
    }

    get isEditable() {
        return this.article().status === 0 || this.article().status === 5;
    }

    statusText(s: number) {
        const map: any = { 0: 'Taslak', 1: 'Gönderildi', 2: 'İncelemede', 3: 'Onaylandı', 4: 'Reddedildi', 5: 'Düzeltme İstendi' };
        return map[s] ?? 'Bilinmiyor';
    }

    actionText(a: number) {
        const map: any = { 1: 'İncelemeye alındı', 2: 'Onaylandı', 3: 'Reddedildi', 4: 'Düzeltme istendi' };
        return map[a] ?? 'İşlem';
    }

    save(isSubmit: boolean) {
        this.ok = false;
        this.error = '';

        if (this.form.invalid) {
            this.error = 'Zorunlu alanlar eksik.';
            return;
        }

        this.loading.set(true);
        const v = this.form.getRawValue();

        const payload = {
            title: v.title!,
            summary: v.summary!,
            content: v.content!,
            categoryId: v.categoryId!,
            tags: v.tags || ''
        };

        this.articleApi.updateArticle(this.article().id, { articleDto: payload, isSubmit: isSubmit }).subscribe({
            next: res => {
                this.loading.set(false);
                if (isSubmit) {
                    this._snackbar.open("Makale yayıma gönderildi.", "Tamam", { duration: 3000 });
                    this.router.navigate(['/my-articles']);
                } else {
                    this._snackbar.open("Taslak güncellendi.", "Tamam", { duration: 3000 });
                    this.article.update(a => ({ ...a, status: 0 })); // Ensure logic reflects state
                    this.ok = true;
                }
            },
            error: err => {
                this.loading.set(false);
                this.error = "Güncelleme başarısız.";
                console.error(err);
            }
        })
    }

    saveDraft() {
        this.save(false);
    }

    publish() {
        this.save(true);
    }
}
