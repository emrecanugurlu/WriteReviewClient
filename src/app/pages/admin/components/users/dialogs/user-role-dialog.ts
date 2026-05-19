import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RoleService, RoleDto } from '../../../../../services/role/role-service';
import { User } from '../../../../../services/user';

@Component({
  selector: 'app-user-role-dialog',
  imports: [CommonModule],
  template: `
    <div class="w-[460px] bg-white rounded-2xl overflow-hidden shadow-xl select-none">

      <!-- Header -->
      <div class="relative bg-gradient-to-br from-slate-900 to-slate-700 px-6 pt-6 pb-10">
        <button (click)="close()"
          class="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <span class="material-symbols-rounded text-[20px]">close</span>
        </button>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {{ (data.fullName || data.userName || '?').charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2 class="text-white font-semibold text-base leading-tight m-0">{{ data.fullName || data.userName }}</h2>
            <p class="text-slate-400 text-[12px] mt-0.5 m-0">Rol Yönetimi</p>
          </div>
        </div>
      </div>

      <!-- Role List Card -->
      <div class="px-6 -mt-4">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          @if (loading()) {
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 last:border-0 animate-pulse">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-lg bg-slate-100"></div>
                  <div class="h-4 w-28 bg-slate-100 rounded"></div>
                </div>
                <div class="w-10 h-5 rounded-full bg-slate-100"></div>
              </div>
            }
          } @else {
            @for (role of allRoles(); track role.id) {
              <div class="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors"
                    [class]="hasRole(role.name) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'">
                    {{ role.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-[13px] font-medium text-slate-800">{{ role.name }}</span>
                </div>

                <!-- Toggle Switch -->
                <button (click)="toggleRole(role.name)" [disabled]="isProcessing(role.name)"
                  class="relative w-10 h-5 rounded-full transition-all duration-200 disabled:opacity-40 focus:outline-none flex-shrink-0"
                  [class]="hasRole(role.name) ? 'bg-indigo-600' : 'bg-slate-200'">
                  @if (isProcessing(role.name)) {
                    <span class="absolute inset-0 flex items-center justify-center">
                      <span class="material-symbols-rounded animate-spin text-[13px]"
                        [class]="hasRole(role.name) ? 'text-white' : 'text-slate-400'">progress_activity</span>
                    </span>
                  } @else {
                    <span class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
                      [class]="hasRole(role.name) ? 'left-5' : 'left-0.5'"></span>
                  }
                </button>
              </div>
            }
          }

        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end px-6 py-5">
        <button (click)="close()"
          class="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-white text-[13px] font-medium transition-all">
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

  close() {
    this.dialogRef.close(this.hasChanges);
  }
}
