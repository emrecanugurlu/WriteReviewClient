import {Component, inject, signal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ArticleService} from '../../../../services/article/article-service';

@Component({
  selector: 'app-add-article',
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-article.html',
  styleUrl: './add-article.scss',
})
export class AddArticle {

  submissionType: 'file' | 'text' = 'text';
  isDragging: boolean = false;
  isSubmitting: boolean = true;
  showSuccessAlert: boolean = false;

  private _snackbar = inject(MatSnackBar)
  loading  = signal(false);
  ok =signal(false);
  error = signal("");

  fb = inject(FormBuilder);
  private articleApi = inject(ArticleService);

  formGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    summary: ['', [Validators.required, Validators.maxLength(400)]],
    content: ['', [Validators.required, Validators.minLength(100)]],
    category: [null as string | null, Validators.required],
    tags: ['']
  });


  formData = {
    title: '',
    abstract: '',
    category: '',
    keywords: '',
    file: null as File | null,
    content: ''
  };

  setSubmissionType(type: 'file' | 'text') {
    this.submissionType = type;
  }

  handleSubmit(isSubmitting: boolean = true) {
    this.ok.set(false);
    this.error.set("");
    this.loading.set(true);

    const v = this.formGroup.value;

    const payload = {
      title: this.formGroup.value.title!,
      summary: this.formGroup.value.summary!,
      content: this.formGroup.value.content!,
      categoryId: "1589dc9d-6906-46c5-ac08-5cb49c9b1be5",
      tags: this.formGroup.value.tags!,
    };

    this.articleApi.createArticle({articleDto:payload,isSubmit:isSubmitting}).subscribe({
      next: _res => {
        this.ok.set(true);
        this.loading.set(false);
        console.log(_res)
      },
      error: err => { this.error.set('Kaydetme sırasında hata oluştu.'); this.loading.set(false); console.error(err); }
    })
  }






  // --- File Upload Logic ---
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
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      this.validateAndSetFile(e.dataTransfer.files[0]);
    }
  }

  onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
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
