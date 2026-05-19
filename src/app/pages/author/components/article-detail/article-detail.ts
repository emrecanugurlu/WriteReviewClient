import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { forkJoin, catchError, of } from 'rxjs';

import { ArticleService } from '../../../../services/article/article-service';
import { ArticleReview } from '../../../../entities/interfaces/article-review';
import { ElementRef, ViewChild } from '@angular/core';
import { CategoryService, CategoryDto } from '../../../../services/category/category-service';

@Component({
    selector: 'app-article-detail',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        DatePipe,
        NgClass,
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
    activeFormats = new Set<string>();

    @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

    protected article = signal({
        id: "",
        updatedAt: "",
        title: "",
        status: 0,
        content: "",
        category: "",
        categoryId: ""
    });

    private articleApi = inject(ArticleService);
    private _snackbar = inject(MatSnackBar)

    // Define form here
    form = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(120)]],
        content: ['', [Validators.required, Validators.minLength(50)]],
        categoryId: [null as string | null, Validators.required]
    });

    categories = signal<CategoryDto[]>([]);
    private categoryService = inject(CategoryService);

    constructor(private route: ActivatedRoute, private router: Router) {
        this.loading.set(true);
        this.categoryService.getAll().subscribe({
            next: (data) => this.categories.set(data),
            error: () => {}
        });
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (!id) {
                this.error = "Makale ID bulunamadı.";
                this.loading.set(false);
                return;
            }

            // İki isteği paralel çalıştır, ikisi de tamamlandığında loading'i kapat
            forkJoin({
                article: this.articleApi.getArticleWithId(id),
                reviews: this.articleApi.getReviews(id).pipe(
                    catchError(() => of([]))  // Hata olursa boş dizi dön, sayfayı engelleme
                )
            }).subscribe({
                next: ({ article, reviews }) => {
                    // Makale verisini set et
                    this.article.set({ ...article });

                    // Review verisini işle
                    const rev: any = reviews;
                    if (rev && 'staff' in rev) {
                        this.reviews = rev.staff;
                    } else {
                        this.reviews = Array.isArray(rev) ? rev : [];
                    }

                    // Form doldur
                    this.form.patchValue({
                        title: article.title,
                        content: article.content,
                        categoryId: article.categoryId
                    });

                    setTimeout(() => {
                        if (this.editorRef && this.editorRef.nativeElement) {
                            this.editorRef.nativeElement.innerHTML = article.content || '';
                        }
                    }, 0);

                    const isEditable = article.status === 0 || article.status === 5;
                    if (!isEditable) {
                        this.form.disable();
                    } else {
                        this.form.enable();
                    }

                    this.wordCount = article.content ? article.content.split(/\s+/).length : 0;

                    this.form.get('content')?.valueChanges.subscribe(val => {
                        this.wordCount = val ? val.split(/\s+/).length : 0;
                    });

                    // Her iki istek de bitti, şimdi loading kapat
                    this.loading.set(false);
                },
                error: err => {
                    this.error = "Makale yüklenemedi.";
                    this.loading.set(false);
                }
            });
        });
    }

    get isEditable() {
        return this.article().status === 0 || this.article().status === 5;
    }

    get readTime(): number {
        return Math.max(1, Math.ceil(this.wordCount / 200));
    }

    get charCount(): number {
        return this.form.get('content')?.value?.length || 0;
    }

    statusText(s: number) {
        const map: any = { 0: 'Taslak', 1: 'Gönderildi', 2: 'İncelemede', 3: 'Onaylandı', 4: 'Reddedildi', 5: 'Düzeltme İstendi' };
        return map[s] ?? 'Bilinmiyor';
    }

    // ── Rich Text Formatting ─────────────────────────────────────────────────

    format(command: string, value?: string) {
        if (!this.isEditable) return;
        if (command === 'formatBlock' && value) {
            document.execCommand(command, false, `<${value}>`);
        } else {
            document.execCommand(command, false, value ?? undefined);
        }
        this.editorRef?.nativeElement.focus();
        setTimeout(() => this.updateActiveFormats(), 0);
    }

    isFormatActive(command: string, value?: string): boolean {
        if (command === 'formatBlock' && value) {
            return this.activeFormats.has(`${command}:${value.toLowerCase()}`);
        }
        return this.activeFormats.has(command);
    }

    updateActiveFormats() {
        const booleanCmds = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'];
        booleanCmds.forEach(cmd => {
            try {
                if (document.queryCommandState(cmd)) {
                    this.activeFormats.add(cmd);
                } else {
                    this.activeFormats.delete(cmd);
                }
            } catch { /* ignore */ }
        });

        const blocks = ['h2', 'h3', 'p'];
        try {
            const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
            blocks.forEach(tag => {
                if (currentBlock.includes(tag)) {
                    this.activeFormats.add(`formatBlock:${tag}`);
                } else {
                    this.activeFormats.delete(`formatBlock:${tag}`);
                }
            });
        } catch { /* ignore */ }
    }

    onEditorInput(event: Event) {
        if (!this.isEditable) return;
        const el = event.target as HTMLElement;
        const text = el.innerText?.trim() ?? '';
        this.wordCount = text ? text.split(/\s+/).length : 0;
        this.form.get('content')?.setValue(el.innerHTML, { emitEvent: false });
        this.updateActiveFormats();
    }

    onEditorKeydown(event: KeyboardEvent) {
        if (!this.isEditable) {
            event.preventDefault();
            return;
        }
        if (event.ctrlKey || event.metaKey) {
            setTimeout(() => this.updateActiveFormats(), 0);
        }
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
            content: v.content!,
            categoryId: v.categoryId!
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
