import { effect, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  private doc = inject(DOCUMENT);

  isDark = signal<boolean>(this.loadPreference());

  constructor() {
    effect(() => {
      this.apply(this.isDark());
    });
  }

  toggle() {
    this.isDark.update(v => !v);
    localStorage.setItem(this.STORAGE_KEY, this.isDark() ? 'dark' : 'light');
  }

  private loadPreference(): boolean {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  }

  private apply(dark: boolean) {
    const body = this.doc.body;
    body.style.colorScheme = dark ? 'dark' : 'light';
    body.classList.toggle('dark', dark);
  }
}
