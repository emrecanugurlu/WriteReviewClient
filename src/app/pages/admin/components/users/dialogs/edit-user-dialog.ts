import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { User } from '../../../../../services/user';
import { UsersDto } from '../../../../../dto/users-dto';

@Component({
  selector: 'app-edit-user-dialog',
  imports: [MatDialogModule, ReactiveFormsModule, NgClass],
  template: `
    <div class="flex flex-col select-none" style="width:420px">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
            <span class="material-symbols-rounded text-white text-[17px]">edit</span>
          </div>
          <div>
            <p class="text-[13px] font-semibold text-slate-800">Kullanıcıyı Düzenle</p>
            <p class="text-[11px] text-slate-400 truncate max-w-[220px]">{{ data.fullName }}</p>
          </div>
        </div>
        <button (click)="close()" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
          <span class="material-symbols-rounded text-[20px]">close</span>
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="submit()" class="px-6 py-5 flex flex-col gap-4">

        <div>
          <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Ad Soyad</label>
          <input formControlName="fullName" type="text"
            class="w-full px-3 py-2.5 rounded-lg border text-[13px] text-slate-800 outline-none transition-all placeholder-slate-300"
            [ngClass]="form.get('fullName')?.invalid && form.get('fullName')?.touched ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white'">
        </div>

        <div>
          <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">E-posta</label>
          <input formControlName="email" type="email"
            class="w-full px-3 py-2.5 rounded-lg border text-[13px] text-slate-800 outline-none transition-all placeholder-slate-300"
            [ngClass]="form.get('email')?.invalid && form.get('email')?.touched ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white'">
        </div>

        @if (error()) {
          <div class="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
            <span class="material-symbols-rounded text-red-400 text-[16px] shrink-0">error</span>
            <p class="text-[12px] text-red-600">{{ error() }}</p>
          </div>
        }

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button type="button" (click)="close()" class="px-4 py-2.5 rounded-lg text-slate-600 text-[13px] font-medium hover:bg-slate-100 transition-all">
            Vazgeç
          </button>
          <button type="submit" [disabled]="loading()"
            class="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-white text-[13px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            @if (loading()) {
              <span class="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
              Kaydediliyor...
            } @else {
              <span class="material-symbols-rounded text-[15px]">save</span>
              Kaydet
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class EditUserDialog {
  private dialogRef = inject(MatDialogRef<EditUserDialog>);
  readonly data = inject<UsersDto>(MAT_DIALOG_DATA);
  private userService = inject(User);
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    fullName: [this.data.fullName, [Validators.required, Validators.minLength(2)]],
    email: [this.data.email, [Validators.required, Validators.email]]
  });

  close() {
    this.dialogRef.close(false);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    const v = this.form.getRawValue();

    this.userService.updateUser(this.data.id, {
      fullName: v.fullName!,
      email: v.email!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Güncelleme başarısız.');
      }
    });
  }
}
