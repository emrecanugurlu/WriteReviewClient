import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService, RoleDto } from '../../../../../services/role/role-service';
import { User } from '../../../../../services/user';

@Component({
  selector: 'app-user-role-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <span class="material-symbols-rounded text-2xl">manage_accounts</span>
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800 m-0">{{ data.fullName || data.userName }}</h2>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-widest">Rol Yönetimi</span>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-8">
          <span class="material-symbols-rounded animate-spin text-indigo-500 text-3xl">progress_activity</span>
        </div>
      } @else {
        <div class="space-y-3">
          @for (role of allRoles(); track role.id) {
            <div class="flex items-center justify-between p-3 rounded-xl border transition-colors"
                 [ngClass]="hasRole(role.name) ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200'">
              <div class="flex items-center gap-3">
                <span class="material-symbols-rounded text-xl" [ngClass]="hasRole(role.name) ? 'text-indigo-600' : 'text-slate-400'">
                  {{ hasRole(role.name) ? 'verified_user' : 'shield' }}
                </span>
                <span class="text-sm font-semibold text-slate-800">{{ role.name }}</span>
              </div>
              
              <button (click)="toggleRole(role.name)" [disabled]="isProcessing(role.name)"
                      class="px-4 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                      [ngClass]="hasRole(role.name) 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'">
                @if (isProcessing(role.name)) {
                  <span class="material-symbols-rounded animate-spin text-[14px]">progress_activity</span>
                }
                {{ hasRole(role.name) ? 'Kaldır' : 'Ata' }}
              </button>
            </div>
          }
        </div>
      }

      <div class="mt-6 flex justify-end">
        <button mat-dialog-close (click)="closeWithResult()" class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors">
          Tamam
        </button>
      </div>
    </div>
  `
})
export class UserRoleDialog implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<UserRoleDialog>);
  roleService = inject(RoleService);
  userService = inject(User);

  loading = signal(true);
  allRoles = signal<RoleDto[]>([]);
  userRoles = signal<string[]>([]);
  processingRoles = signal<string[]>([]);
  hasChanges = false;

  ngOnInit() {
    this.userRoles.set(this.data.roles || []);
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.allRoles.set(roles);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  hasRole(roleName: string): boolean {
    return this.userRoles().includes(roleName);
  }

  isProcessing(roleName: string): boolean {
    return this.processingRoles().includes(roleName);
  }

  toggleRole(roleName: string) {
    if (this.isProcessing(roleName)) return;

    this.processingRoles.update(list => [...list, roleName]);
    const currentlyHas = this.hasRole(roleName);

    if (currentlyHas) {
      this.userService.removeRole(this.data.id, roleName).subscribe({
        next: () => {
          this.userRoles.update(list => list.filter(r => r !== roleName));
          this.processingRoles.update(list => list.filter(r => r !== roleName));
          this.hasChanges = true;
        },
        error: (err) => {
          this.processingRoles.update(list => list.filter(r => r !== roleName));
          alert(err.error?.Message || 'Rol kaldırılamadı.');
        }
      });
    } else {
      this.userService.assignRole(this.data.id, roleName).subscribe({
        next: () => {
          this.userRoles.update(list => [...list, roleName]);
          this.processingRoles.update(list => list.filter(r => r !== roleName));
          this.hasChanges = true;
        },
        error: (err) => {
          this.processingRoles.update(list => list.filter(r => r !== roleName));
          alert(err.error?.Message || 'Rol atanamadı.');
        }
      });
    }
  }

  closeWithResult() {
    this.dialogRef.close(this.hasChanges);
  }
}
