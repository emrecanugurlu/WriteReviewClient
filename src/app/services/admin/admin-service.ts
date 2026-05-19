import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type AdminStatsDto = {
  userCount: number;
  expertiseAreaCount: number;
  submitted: number;
  inReview: number;
  approved: number;
  rejected: number;
  revisionsRequested: number;
  recentArticles: {
    id: string;
    title: string;
    authorName: string;
    status: number;
    updatedAt: string;
  }[];
};

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  getStats() {
    return this.http.get<AdminStatsDto>('/api/admin/stats');
  }
}
