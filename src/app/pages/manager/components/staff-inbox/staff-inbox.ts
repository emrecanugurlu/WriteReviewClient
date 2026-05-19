import {Component, inject, OnInit, signal} from '@angular/core';
import {PageResult} from '../../../../entities/interfaces/page-result';
import {ArticleService} from '../../../../services/article/article-service';
import {DatePipe, NgClass} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-staff-inbox',
  imports: [
    DatePipe,
    NgClass,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: './staff-inbox.html',
  styleUrl: './staff-inbox.scss'
})
export default class StaffInbox implements OnInit {

  items: any[] = [];
  page = 1;
  pageSize = 10;
  total = 0;
  loading = signal(false);
  error = '';
  status: number | undefined = undefined;
  fb = inject(FormBuilder);
  allItems: any[] = [];
  q = new FormControl('');
  dialog = inject(MatDialog);

  actionForId: string | null = null;
  actionType: 'review' | 'approve' | 'reject' | 'revreq' | null = null;
  actionForm!: FormGroup;
  submitting = false;
  router = inject(Router);

  constructor(private api: ArticleService) {
  }

  ngOnInit() {
    this.actionForm = this.fb.group({
      note: [''],
      reason: ['']
    });
    this.q.valueChanges.pipe(debounceTime(250), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
    this.load();
  }

  applyFilters() {
    const term = (this.q.value ?? '').toString().trim().toLowerCase();
    const src = this.allItems ?? [];
    this.items = term
      ? src.filter(x => (x.title ?? '').toLowerCase().includes(term))
      : src.slice();
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  load() {
    this.loading.set(true);
    this.error = '';
    this.api.getStaffArticles(this.page, this.pageSize, this.status).subscribe({
      next: (res: PageResult<any>) => {
        this.items = res.items;
        this.total = res.total;
        //this.applyFilters()
        this.loading.set(false);
      },
      error: _ => {
        this.error = 'Liste alınamadı.';
        this.loading.set(false);
      }
    });
  }

  articleDetail(id: number) {
    this.router.navigate(['/article-detail',id]).then(r => {});
  }

  openAction(id: string, type: 'review'|'approve'|'reject'|'revreq'){
    this.router.navigate(['/assign-experts', id]);
  }

  cancelAction(){ this.actionForId = null; this.actionType = null; }

  private updateRowStatusLocal(id: string, newStatus: number) {
    const idx = this.items.findIndex(x => x.id === id);
    if (idx >= 0) this.items[idx] = { ...this.items[idx], status: newStatus, updatedAt: new Date().toISOString() };
  }

  // Gönder
  submitAction(){
    if (!this.actionForId || !this.actionType) return;
    if (this.actionForm.invalid) { this.actionForm.markAllAsTouched(); return; }

    this.submitting = true;
    const id = this.actionForId;

    switch (this.actionType) {
      case 'review': {
        const body = { note: this.actionForm.value.note };
        this.updateRowStatusLocal(id, 2);
        this.api.takeToReview(id, body).subscribe({
          next: _ => { this.submitting = false; this.cancelAction(); },
          error: _ => { this.error='İncelemeye alma başarısız.'; this.load(); } // sunucudan geri oku
        });
        break;
      }
      case 'approve': {
        const body = { note: this.actionForm.value.note };
        this.updateRowStatusLocal(id, 3);
        this.api.approve(id, body).subscribe({
          next: _ => { this.submitting = false; this.cancelAction(); },
          error: _ => { this.error='Onaylama başarısız.'; this.load(); }
        });
        break;
      }
      case 'reject': {
        const body = { reason: this.actionForm.value.reason };
        this.updateRowStatusLocal(id, 4);
        this.api.reject(id, body).subscribe({
          next: _ => { this.submitting = false; this.cancelAction(); },
          error: _ => { this.error='Reddetme başarısız.'; this.load(); }
        });
        break;
      }
      case 'revreq': {
        const body = { note: this.actionForm.value.note };
        this.updateRowStatusLocal(id, 5);
        this.api.requestRevision(id, body).subscribe({
          next: _ => { this.submitting = false; this.cancelAction(); },
          error: _ => { this.error='Düzeltme isteme başarısız.'; this.load(); }
        });
        break;
      }
    }
  }

  setStatus(s: number | undefined) {
    this.status = s;
    this.page = 1;
    this.load();
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }

  next() {
    if (this.page < this.totalPages) {
      this.page++;
      this.load();
    }
  }

  statusText(s: number) {
    return s === 1 ? 'Submitted' : s === 2 ? 'InReview' : s === 3 ? 'Approved' : s === 4 ? 'Rejected' : s === 5 ? 'RevisionsRequested' : 'Draft';
  }

  review(id: string) {
    this.loading.set(true);
    const body = {
      note: this.actionForm.value.note
    }
    this.api.takeToReview(id,body).subscribe({
      next: _ => { this.load(); },
      error: _ => { this.error = 'İncelemeye alma başarısız.'; this.loading.set(false); },
    });
  }

  approve(id: string) {
    this.loading.set(true);
    const body = {
      note: this.actionForm.value.note
    }
    this.api.approve(id,body).subscribe({
      next: _ => { this.load(); },
      error: _ => { this.error = 'Onaylama başarısız.'; this.loading.set(false); },
    })
  }

  reject(id: string) {
    this.loading.set(true);
    const body = {
      reason: this.actionForm.value.reason
    }
    this.api.reject(id,body).subscribe({
      next: _ => { this.load(); },
      error: _ => { this.error = 'Reddetme başarısız.'; this.loading.set(false); },
    });
  }

  requestRev(id: string) {
    this.loading.set(true);
    const body = {
      note: this.actionForm.value.note
    }
    this.api.requestRevision(id,body).subscribe({
      next: _ => { this.load(); },
      error: _ => { this.error = 'Düzeltme isteme başarısız.'; this.loading.set(false); },
    });
  }
}


