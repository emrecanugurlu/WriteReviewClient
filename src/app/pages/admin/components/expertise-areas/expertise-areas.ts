import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExpertiseArea } from '../../../../services/expertise-area/expertise-area';
import { ExpertiseAreaWithUsersDto } from '../../../../dto/expertise-area-with-users-dto';
import { AddExpertiseAreaDialog } from '../../../../views/add-expertise-area-dialog/add-expertise-area-dialog';
import { AssignUsersDialog } from '../../../../views/assign-users-dialog/assign-users-dialog';

@Component({
  selector: 'app-expertise-areas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './expertise-areas.html',
  styleUrl: './expertise-areas.scss'
})
export class ExpertiseAreas implements OnInit {
  private expertiseAreaService = inject(ExpertiseArea);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  expertiseAreas = signal<ExpertiseAreaWithUsersDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  ok = signal(false);
  searchQuery = signal('');

  ngOnInit(): void {
    this.loadExpertiseAreas();
  }

  loadExpertiseAreas() {
    this.loading.set(true);
    this.expertiseAreaService.getAllExpertiseAreaWithUsers().subscribe({
      next: (data) => {
        this.expertiseAreas.set(data);
        this.loading.set(false);
        this.ok.set(true);
      },
      error: (err) => {
        this.error.set('Uzmanlık alanları yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error('Error fetching expertise areas:', err);
      }
    });
  }

  filteredAreas = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.expertiseAreas();
    return this.expertiseAreas().filter(area => 
      area.name.toLowerCase().includes(query)
    );
  });

  openAddDialog() {
    const dialogRef = this.dialog.open(AddExpertiseAreaDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpertiseAreas();
      }
    });
  }

  deleteArea(id: string) {
    if (!confirm('Bu uzmanlık alanını silmek istediğinize emin misiniz?')) return;

    this.expertiseAreaService.deleteExpertiseArea(id).subscribe({
      next: () => {
        this.expertiseAreas.update(areas => areas.filter(a => a.id !== id));
        this.snackbar.open('Uzmanlık alanı silindi.', 'Tamam', { duration: 3000 });
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Silme işlemi başarısız.';
        this.snackbar.open(msg, 'Kapat', { duration: 4000 });
      }
    });
  }

  openAssignUsers(area: ExpertiseAreaWithUsersDto) {
    const ref = this.dialog.open(AssignUsersDialog, {
      data: {
        areaId: area.id,
        areaName: area.name,
        assignedUserIds: area.users.map(u => u.id),
      },
      panelClass: 'modern-dialog',
    });
    ref.afterClosed().subscribe(changed => {
      if (changed) this.loadExpertiseAreas();
    });
  }

  editArea(area: ExpertiseAreaWithUsersDto) {
    const dialogRef = this.dialog.open(AddExpertiseAreaDialog, {
      width: '400px',
      data: { id: area.id, name: area.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpertiseAreas();
        this.snackbar.open('Uzmanlık alanı güncellendi.', 'Tamam', { duration: 3000 });
      }
    });
  }
}
