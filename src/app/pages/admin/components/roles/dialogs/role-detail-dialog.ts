import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../../../services/role/role-service';

@Component({
  selector: 'app-role-detail-dialog',
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="p-6">
      <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <div class="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
          <span class="material-symbols-rounded text-2xl">admin_panel_settings</span>
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800 m-0">{{ data.name }}</h2>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-widest">Rol Detayları</span>
        </div>
      </div>

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-8">
          <span class="material-symbols-rounded animate-spin text-cyan-500 text-3xl">progress_activity</span>
          <p class="text-sm text-slate-500 mt-2">Detaylar yükleniyor...</p>
        </div>
      } @else if (error()) {
        <div class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
          {{ error() }}
        </div>
      } @else {
        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-semibold text-slate-500">Rol ID</span>
            <span class="text-xs font-mono bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{{ detail()?.id }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm font-semibold text-slate-500">Kayıtlı Kullanıcı</span>
            <div class="flex items-center gap-1.5 bg-white px-3 py-1 rounded shadow-sm border border-slate-100">
              <span class="material-symbols-rounded text-[16px] text-cyan-500">group</span>
              <span class="text-sm font-bold text-slate-800">{{ detail()?.userCount }} Kişi</span>
            </div>
          </div>
        </div>
        
        <p class="text-xs text-slate-400 mt-4 text-center">Bu roldeki kullanıcılara rol ekleme ve çıkarma işlemlerini Kullanıcı Yönetimi sayfasından yapabilirsiniz.</p>
      }

      <div class="mt-6 flex justify-end">
        <button mat-dialog-close class="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors">
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
