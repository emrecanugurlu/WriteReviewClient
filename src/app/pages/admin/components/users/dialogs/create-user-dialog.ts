import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { User } from '../../../../../services/user';

@Component({
  selector: 'app-create-user-dialog',
  imports: [MatDialogModule, ReactiveFormsModule, NgClass],
  template: `
    <div class="flex flex-col select-none" style="width:420px">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
            <span class="material-symbols-rounded text-white text-[17px]">person_add</span>
          </div>
          <div>
            <p class="text-[13px] font-semibold text-slate-800">Yeni Kullanıcı</p>
            <p class="text-[11px] text-slate-400">Sisteme yeni kullanıcı ekleyin</p>
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
          <input formControlName="fullName" type="text" placeholder="Ahmet Yılmaz"
            class="w-full px-3 py-2.5 rounded-lg border text-[13px] text-slate-800 outline-none transition-all placeholder-slate-300"
            [ngClass]="form.get('fullName')?.invalid && form.get('fullName')?.touched ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white'">
        </div>

        <div>
          <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">E-posta</label>
          <input formControlName="email" type="email" placeholder="kullanici@ornek.com"
            class="w-full px-3 py-2.5 rounded-lg border text-[13px] text-slate-800 outline-none transition-all placeholder-slate-300"
            [ngClass]="form.get('email')?.invalid && form.get('email')?.touched ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white'">
        </div>

        <div>
          <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Kullanıcı Adı</label>
          <input formControlName="userName" type="text" placeholder="ahmetyilmaz"
            class="w-full px-3 py-2.5 rounded-lg border text-[13px] text-slate-800 outline-none transition-all placeholder-slate-300"
            [ngClass]="form.get('userName')?.invalid && form.get('userName')?.touched ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white'">
        </div>

        <div>
          <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Şifre</label>
          <input formControlName="password" type="password" placeholder="En az 6 karakter"
            class="w-full px-3 py-2.5 rounded-lg border text-[13px] text-slate-800 outline-none transition-all placeholder-slate-300"
            [ngClass]="form.get('password')?.invalid && form.get('password')?.touched ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white'">
          <p class="text-[11px] text-slate-400 mt-1">En az 6 karakter, büyük harf ve rakam içermeli.</p>
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
              Oluşturuluyor...
            } @else {
              <span class="material-symbols-rounded text-[15px]">person_add</span>
              Oluştur
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class CreateUserDialog {
  private dialogRef = inject(MatDialogRef<CreateUserDialog>);
  private userService = inject(User);
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    userName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
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

    this.userService.createUser({
      fullName: v.fullName!,
      email: v.email!,
      userName: v.userName!,
      password: v.password!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading.set(false);
        const errors: string[] = err.error?.errors ?? [];
        this.error.set(errors.length ? errors[0] : (err.error?.message ?? 'Kullanıcı oluşturulamadı.'));
      }
    });
  }
}
