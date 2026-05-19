import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, inject, model, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expert } from '../../services/expert';
import { ExpertDto } from '../../dto/experts-dto';
import { AssignExpertsDto } from '../../dto/assign-experts-dto';

@Component({
  selector: 'app-set-experts-dialog',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgClass,
    FormsModule,
  ],
  templateUrl: './set-experts-dialog.html',
  styleUrl: './set-experts-dialog.scss'
})
export default class SetExpertsDialog {

  dialogRef = inject(MatDialogRef<SetExpertsDialog>);
  expertService = inject(Expert);
  experts = signal<ExpertDto[]>([]);
  loading = signal(false);
  error = signal("");
  ok = signal(false);
  selectedExpertIds = signal<string[]>([]);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly articleId = model(this.data.articleId as string);
  readonly currentExperts = signal<string[]>(this.data.experts || []);

  searchQuery = signal('');
  resetPagination() {
    this.currentPage.set(1);
  }
  selectedSpecialty = signal<string | null>(null);


get uniqueSpecialties(): string[] {
  const expertsValue = this.experts(); // Signal'in değerini al
  
  // Array kontrolü yap
  if (!Array.isArray(expertsValue)) {
    console.log('experts is not an array:', expertsValue);
    return [];
  }
  
  const allAreas = expertsValue.flatMap(e => e.expertiseAreas || []);
  return [...new Set(allAreas)].sort();
}
  
  setSpecialtyFilter(specialty: string | null) {
    this.selectedSpecialty.set(specialty);
    this.resetPagination();
  }


  isSelected(id: string): boolean {
    return this.selectedExpertIds().includes(id);
  }


  Math = Math;

  filters = {
    search: signal(''),
    expertise: signal('')
  };


  showSuccessToast = signal(false);
  selectedCountForToast = 0;

  currentPage = signal(1);
  itemsPerPage = 4;
  pageSize = signal(4);

  totalPages = computed(() => Math.ceil(this.filteredExperts().length / this.pageSize()));

  paginatedExperts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.filteredExperts().slice(startIndex, endIndex);
  });

  constructor() {
    this.loading.set(true);
    // Initialize selected IDs with current experts
    this.selectedExpertIds.set([...this.currentExperts()]);

    this.expertService.getAllExperts().subscribe({
      next: (result) => {
        this.loading.set(false);
        this.ok.set(true);
        console.log('Uzmanlar yüklendi:', result);
        this.experts.set(result);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set("Error: " + err.message);
        console.error('Uzmanlar yüklenirken hata oluştu:', err);
      }
    });
  }

  assignExperts(assignExpertsDto: AssignExpertsDto){
    this.expertService.addArticleExperts({
      articleId: assignExpertsDto.articleId,
      expertsId: assignExpertsDto.expertIds
    }).subscribe({
      next: (result) => {
        console.log('Uzmanlar atandı:', result);
        this.selectedCountForToast = assignExpertsDto.expertIds.length;
        this.showSuccessToast.set(true);  
        },
        error: (err) => {
          console.error('Uzmanlar atanırken hata oluştu:', err);
        }
  })};

  filteredExperts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const specialty = this.selectedSpecialty();

    return this.experts().filter(expert => {
      // 1. Search Filter
      const matchesSearch = expert.name.toLowerCase().includes(query) ||
        expert.expertiseAreas[0].toLowerCase().includes(query);

      // 2. Specialty Filter
      const matchesSpecialty = specialty ? expert.expertiseAreas[0] === specialty : true;

      return matchesSearch && matchesSpecialty;
    });
  });




  openDialog() {
    this.resetFilters();
    this.selectedExpertIds.set([]);
  }

  closeDialog() {
    this.dialogRef.close();
  }


  resetFilters() {
    this.filters.search.set('');
    this.filters.expertise.set('');
    this.currentPage.set(1);
  }

    toggleExpert(id: string) {
    this.selectedExpertIds.update(ids => {
      if (ids.includes(id)) {
        return ids.filter(i => i !== id);
      } else {
        if (ids.length >= 3) return ids;
        return [...ids, id];
      }
    });
  }


 nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  getSelectedExperts() {
    return this.experts().filter(e => this.selectedExpertIds().includes(e.id));
  }

  /** Sağ paneldeki boş slot sayısını döner (max 3 uzman) */
  getEmptySlots(): number[] {
    const remaining = 3 - this.selectedExpertIds().length;
    return Array.from({ length: remaining }, (_, i) => i + 1);
  }

}
