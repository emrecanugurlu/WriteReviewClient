import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboard {
  // Mock data for the dashboard stats
  stats = [
    { title: 'Toplam Kullanıcı', value: '1,248', icon: 'group', color: 'text-blue-600', bgColor: 'bg-blue-50', trend: '+12%', trendUp: true },
    { title: 'Bekleyen Makale', value: '34', icon: 'pending_actions', color: 'text-orange-600', bgColor: 'bg-orange-50', trend: '-5%', trendUp: false },
    { title: 'Yayınlanan Makale', value: '892', icon: 'check_circle', color: 'text-green-600', bgColor: 'bg-green-50', trend: '+24%', trendUp: true },
    { title: 'Uzmanlık Alanları', value: '45', icon: 'category', color: 'text-purple-600', bgColor: 'bg-purple-50', trend: 'Sabit', trendUp: true }
  ];

  // Mock data for recent activities
  recentActivities = [
    { user: 'Ahmet Yılmaz', action: 'yeni bir makale gönderdi', time: '10 dakika önce', icon: 'article', iconColor: 'text-blue-500' },
    { user: 'Ayşe Demir', action: 'hakem değerlendirmesini tamamladı', time: '1 saat önce', icon: 'fact_check', iconColor: 'text-green-500' },
    { user: 'Mehmet Can', action: 'yeni kullanıcı kaydı oluşturuldu', time: '3 saat önce', icon: 'person_add', iconColor: 'text-purple-500' },
    { user: 'Sistem', action: 'haftalık yedekleme tamamlandı', time: 'Dün', icon: 'cloud_done', iconColor: 'text-slate-500' }
  ];
}
