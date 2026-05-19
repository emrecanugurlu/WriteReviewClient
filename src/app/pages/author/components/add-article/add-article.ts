import { Component, ElementRef, ViewChild, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticleService } from '../../../../services/article/article-service';
import { CategoryService, CategoryDto } from '../../../../services/category/category-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-article',
  imports: [
    DecimalPipe,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './add-article.html',
  styleUrl: './add-article.scss',
})
export class AddArticle implements OnInit {

  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  submissionType: 'file' | 'text' = 'text';
  isDragging: boolean = false;
  showSuccessAlert: boolean = false;

  editorIsEmpty = signal(true);
  editorCharCount = 0;
  activeFormats = new Set<string>();

  private _snackbar = inject(MatSnackBar);
  loading = signal(false);
  ok = signal(false);
  error = signal('');
  categories = signal<CategoryDto[]>([]);

  fb = inject(FormBuilder);
  private articleApi = inject(ArticleService);
  private categoryService = inject(CategoryService);

  formGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    content: ['', [Validators.required, Validators.minLength(100)]],
    categoryId: [null as string | null, Validators.required]
  });

  ngOnInit() {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: () => this.error.set('Kategoriler yüklenemedi.')
    });
  }

  formData = {
    title: '',
    category: '',
    file: null as File | null,
    content: ''
  };

  // ── Rich Text Formatting ─────────────────────────────────────────────────

  format(command: string, value?: string) {
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

    // Handle formatBlock values
    const blocks = ['h2', 'h3', 'p'];
    try {
      const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
      blocks.forEach(tag => {
        // currentBlock might be 'h2' or '<h2' or full tag depending on browser
        if (currentBlock.includes(tag)) {
          this.activeFormats.add(`formatBlock:${tag}`);
        } else {
          this.activeFormats.delete(`formatBlock:${tag}`);
        }
      });
    } catch { /* ignore */ }
  }

  onEditorInput(event: Event) {
    const el = event.target as HTMLElement;
    const text = el.innerText?.trim() ?? '';
    this.editorIsEmpty.set(text.length === 0);
    this.editorCharCount = text.length;
    this.formGroup.get('content')?.setValue(el.innerHTML, { emitEvent: false });
    this.updateActiveFormats();
  }

  onEditorKeydown(event: KeyboardEvent) {
    // Allow default browser Ctrl+B/I/U, just update format state after
    if (event.ctrlKey || event.metaKey) {
      setTimeout(() => this.updateActiveFormats(), 0);
    }
  }

  // ── Submission ────────────────────────────────────────────────────────────

  setSubmissionType(type: 'file' | 'text') {
    this.submissionType = type;
  }

  handleSubmit(isSubmitting: boolean = true) {
    this.ok.set(false);
    this.error.set('');
    this.loading.set(true);

    const payload = {
      title: this.formGroup.value.title!,
      content: this.formGroup.value.content!,
      categoryId: this.formGroup.value.categoryId!
    };

    this.articleApi.createArticle({ articleDto: payload, isSubmit: isSubmitting }).subscribe({
      next: _res => {
        this.ok.set(true);
        this.loading.set(false);
        this.showSuccessAlert = true;
      },
      error: err => {
        this.error.set('Kaydetme sırasında hata oluştu.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  // ── File Upload ───────────────────────────────────────────────────────────

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer?.files?.length) {
      this.validateAndSetFile(e.dataTransfer.files[0]);
    }
  }

  onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  validateAndSetFile(file: File) {
    if (file.type === 'application/pdf' || file.type.includes('word') || file.type.includes('officedocument')) {
      this.formData.file = file;
    } else {
      alert('Lütfen sadece PDF veya Word dosyası yükleyiniz.');
    }
  }

  removeFile() {
    this.formData.file = null;
  }
}
