import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { AdminService, AdminStatsDto } from '../../../../services/admin/admin-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, DatePipe, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboard implements OnInit {

  private adminService = inject(AdminService);

  loading = signal(false);
  stats = signal<AdminStatsDto | null>(null);

  ngOnInit() {
    this.loading.set(true);
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  get totalArticles(): number {
    const s = this.stats();
    if (!s) return 0;
    return s.submitted + s.inReview + s.approved + s.rejected + s.revisionsRequested;
  }

  barWidth(count: number): string {
    const total = this.totalArticles;
    if (!total) return '0%';
    return Math.round((count / total) * 100) + '%';
  }

  statusLabel(status: number): string {
    const map: Record<number, string> = {
      1: 'Gönderildi', 2: 'Hakemde', 3: 'Onaylandı', 4: 'Reddedildi', 5: 'Revizyon'
    };
    return map[status] ?? 'Bilinmiyor';
  }

  statusIcon(status: number): string {
    const map: Record<number, string> = {
      1: 'send', 2: 'rate_review', 3: 'check_circle', 4: 'cancel', 5: 'plumbing'
    };
    return map[status] ?? 'article';
  }

  statusIconColor(status: number): string {
    const map: Record<number, string> = {
      1: 'text-blue-500', 2: 'text-violet-500', 3: 'text-emerald-500',
      4: 'text-red-400', 5: 'text-amber-500'
    };
    return map[status] ?? 'text-slate-400';
  }
}
