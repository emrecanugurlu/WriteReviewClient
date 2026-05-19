import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type CategoryDto = { id: string; name: string };

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<CategoryDto[]>('/api/categories');
  }
}
