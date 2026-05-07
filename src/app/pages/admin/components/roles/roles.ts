import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleDto, RoleService } from '../../../../services/role/role-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RoleDetailDialog } from './dialogs/role-detail-dialog';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class Roles implements OnInit {
  private roleService = inject(RoleService);
  private dialog = inject(MatDialog);

  roles = signal<RoleDto[]>([]);
  loading = signal(false);
  error = signal('');
  
  searchQuery = signal('');
  
  filteredRoles = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.roles();
    return this.roles().filter(r => r.name.toLowerCase().includes(query));
  });

  isAdding = signal(false);
  newRoleName = signal('');
  addError = signal('');
  addLoading = signal(false);

  ngOnInit() {
    this.fetchRoles();
  }

  fetchRoles() {
    this.loading.set(true);
    this.error.set('');
    this.roleService.getRoles().subscribe({
      next: (res) => {
        this.roles.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Roller yüklenirken bir hata oluştu.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  toggleAddMode() {
    this.isAdding.set(!this.isAdding());
    this.newRoleName.set('');
    this.addError.set('');
  }

  saveNewRole() {
    const name = this.newRoleName().trim();
    if (!name) {
      this.addError.set('Rol adı boş olamaz.');
      return;
    }

    this.addLoading.set(true);
    this.addError.set('');
    
    this.roleService.createRole(name).subscribe({
      next: (res) => {
        this.addLoading.set(false);
        this.isAdding.set(false);
        this.newRoleName.set('');
        this.fetchRoles(); // Refresh
      },
      error: (err) => {
        this.addLoading.set(false);
        this.addError.set(err.error?.Message || 'Rol eklenirken bir hata oluştu.');
      }
    });
  }

  deleteRole(id: string, name: string) {
    if (confirm(`'${name}' rolünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.fetchRoles();
        },
        error: (err) => {
          alert(err.error?.Message || 'Rol silinemedi.');
        }
      });
    }
  }

  isStandardRole(name: string): boolean {
    return ['Admin', 'Manager', 'Expert', 'Author'].includes(name);
  }

  openDetail(role: RoleDto) {
    this.dialog.open(RoleDetailDialog, {
      data: { id: role.id, name: role.name },
      width: '400px',
      panelClass: 'modern-dialog'
    });
  }
}
