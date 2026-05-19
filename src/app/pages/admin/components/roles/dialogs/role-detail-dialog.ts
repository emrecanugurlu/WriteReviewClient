import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../../../services/role/role-service';

@Component({
  selector: 'app-role-detail-dialog',
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="flex flex-col w-[380px]">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
            <span class="material-symbols-rounded text-white text-[17px]">shield</span>
          </div>
          <div>
            <p class="text-[13px] font-semibold text-slate-800 dark:text-slate-100">{{ data.name }}</p>
            <p class="text-[11px] text-slate-400 dark:text-slate-500">Rol Detayları</p>
          </div>
        </div>
        <button mat-dialog-close
          class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
          <span class="material-symbols-rounded text-[20px]">close</span>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        @if (loading()) {
          <div class="flex flex-col items-center justify-center py-8 gap-2">
            <span class="material-symbols-rounded animate-spin text-slate-400 dark:text-slate-500 text-3xl">progress_activity</span>
            <p class="text-[13px] text-slate-400 dark:text-slate-500">Yükleniyor...</p>
          </div>
        } @else if (error()) {
          <div class="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800/50 p-4 rounded-xl text-[13px] text-red-600 dark:text-red-400">
            {{ error() }}
          </div>
        } @else {
          <div class="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-700 flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <span class="text-[12px] font-medium text-slate-400 dark:text-slate-500">Rol ID</span>
              <span class="text-[11px] font-mono bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                {{ detail()?.id }}
              </span>
            </div>
            <div class="h-px bg-slate-100 dark:bg-slate-700"></div>
            <div class="flex justify-between items-center">
              <span class="text-[12px] font-medium text-slate-400 dark:text-slate-500">Kayıtlı Kullanıcı</span>
              <div class="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">
                <span class="material-symbols-rounded text-[16px] text-slate-400 dark:text-slate-500">group</span>
                <span class="text-[13px] font-bold text-slate-800 dark:text-slate-100">{{ detail()?.userCount }} Kişi</span>
              </div>
            </div>
          </div>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center leading-relaxed">
            Rol atamalarını Kullanıcı Yönetimi sayfasından yapabilirsiniz.
          </p>
        }
      </div>

      <!-- Footer -->
      <div class="flex justify-end px-6 py-4 border-t border-slate-100 dark:border-slate-700">
        <button mat-dialog-close
          class="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-[13px] transition-colors">
          Kapat
        </button>
      </div>

    </div>
  `
})
export class RoleDetailDialog {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RoleDetailDialog>);
  roleService = inject(RoleService);

  loading = signal(true);
  error = signal('');
  detail = signal<any>(null);

  constructor() {
    this.fetchDetail();
  }

  fetchDetail() {
    this.roleService.getRoleDetail(this.data.id).subscribe({
      next: (res) => {
        this.detail.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Detaylar yüklenirken bir hata oluştu.');
        this.loading.set(false);
      }
    });
  }
}
