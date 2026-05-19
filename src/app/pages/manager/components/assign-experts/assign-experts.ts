import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Expert } from '../../../../services/expert';
import { ExpertDto } from '../../../../dto/experts-dto';

@Component({
  selector: 'app-assign-experts',
  imports: [CommonModule, NgClass, FormsModule, RouterLink],
  templateUrl: './assign-experts.html',
  styleUrl: './assign-experts.scss'
})
export class AssignExperts implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private expertService = inject(Expert);

  // Route param
  articleId = signal('');

  // Data
  experts      = signal<ExpertDto[]>([]);
  loading      = signal(true);
  error        = signal('');
  submitting   = signal(false);
  submitted    = signal(false);

  // Selection
  selectedIds  = signal<string[]>([]);

  // Search & Filter
  searchQuery       = signal('');
  selectedSpecialty = signal<string | null>(null);
  sortBy            = signal<'name' | 'workload-asc' | 'workload-desc'>('name');

  // Pagination
  currentPage = signal(1);
  pageSize    = 5;

  // ── Computed ────────────────────────────────────────────────

  get uniqueSpecialties(): string[] {
    const list = this.experts();
    if (!Array.isArray(list)) return [];
    return [...new Set(list.flatMap(e => e.expertiseAreas || []))].sort();
  }

  filteredExperts = computed(() => {
    const q    = this.searchQuery().toLowerCase().trim();
    const spec = this.selectedSpecialty();
    const sort = this.sortBy();

    let result = this.experts().filter(e => {
      const matchSearch  = !q || e.name.toLowerCase().includes(q) || e.expertiseAreas[0]?.toLowerCase().includes(q);
      const matchSpecial = !spec || e.expertiseAreas[0] === spec;
      return matchSearch && matchSpecial;
    });

    if (sort === 'name')          result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'workload-asc')  result = [...result].sort((a, b) => a.activeTasks - b.activeTasks);
    if (sort === 'workload-desc') result = [...result].sort((a, b) => b.activeTasks - a.activeTasks);

    return result;
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredExperts().length / this.pageSize))
  );

  paginatedExperts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredExperts().slice(start, start + this.pageSize);
  });

  selectedExperts = computed(() =>
    this.experts().filter(e => this.selectedIds().includes(e.id))
  );

  emptySlots = computed(() =>
    Array.from({ length: 3 - this.selectedIds().length }, (_, i) => i + 1)
  );

  canSubmit = computed(() => this.selectedIds().length > 0 && !this.submitting());

  // Stats
  availableCount = computed(() =>
    this.experts().filter(e => e.activeTasks === 0).length
  );
  busyCount = computed(() =>
    this.experts().filter(e => e.activeTasks >= 3).length
  );
  totalWorkload = computed(() =>
    this.selectedExperts().reduce((s, e) => s + e.activeTasks, 0)
  );

  // ── Lifecycle ───────────────────────────────────────────────

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      this.articleId.set(p.get('id') ?? '');
    });

    this.expertService.getAllExperts().subscribe({
      next: res => {
        this.experts.set(res);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message ?? 'Bir hata oluştu.');
        this.loading.set(false);
      }
    });
  }

  // ── Actions ─────────────────────────────────────────────────

  isSelected(id: string) { return this.selectedIds().includes(id); }

  toggleExpert(id: string) {
    this.selectedIds.update(ids => {
      if (ids.includes(id)) return ids.filter(i => i !== id);
      if (ids.length >= 3)  return ids;
      return [...ids, id];
    });
  }

  clearAll() { this.selectedIds.set([]); }

  setSpecialtyFilter(s: string | null) {
    this.selectedSpecialty.set(s);
    this.currentPage.set(1);
  }

  onSearch(q: string) {
    this.searchQuery.set(q);
    this.currentPage.set(1);
  }

  onSortChange(val: string) {
    this.sortBy.set(val as 'name' | 'workload-asc' | 'workload-desc');
    this.currentPage.set(1);
  }

  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }

  goBack() { this.router.navigate(['/article-detail', this.articleId()]); }

  assign() {
    if (!this.canSubmit()) return;
    this.submitting.set(true);
    this.expertService.addArticleExperts({
      articleId:  this.articleId(),
      expertsId:  this.selectedIds()
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: err => {
        this.submitting.set(false);
        this.error.set(err.message ?? 'Atama sırasında hata oluştu.');
      }
    });
  }

  workloadLabel(tasks: number): string {
    if (tasks === 0) return 'Müsait';
    if (tasks <= 2)  return 'Orta';
    return 'Yoğun';
  }

  workloadClass(tasks: number): string {
    if (tasks === 0) return 'badge--green';
    if (tasks <= 2)  return 'badge--amber';
    return 'badge--red';
  }
}
