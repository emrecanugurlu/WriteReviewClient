import {Component, inject, OnInit, signal} from '@angular/core';
import {ArticleService} from '../../services/article/article-service';
import {DatePipe, NgStyle} from '@angular/common';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {ArticleListItem} from '../../entities/interfaces/article-list-item';
import {MatIcon} from '@angular/material/icon';


@Component({
  selector: 'app-my-articles',
  imports: [
    DatePipe,
    MatButton,
    NgStyle,
    MatIcon,
  ],
  templateUrl: './my-articles.html',
  styleUrl: './my-articles.scss'
})
export class MyArticles implements OnInit {

  api = inject(ArticleService)
  loading = signal(false);
  error: string = "";
  page = 1; pageSize = 10; total = 0;
  items: ArticleListItem[] = [];
  router = inject(Router);

  get totalPages() { return Math.max(1, Math.ceil(this.total / this.pageSize)); }

  ngOnInit() {

  }
  constructor() {
    this.load();
  }

  prev(){ if (this.page>1){ this.page--; this.load(); } }
  next(){ if (this.page < this.totalPages){ this.page++; this.load(); } }

  load() {
    this.loading.set(true);
    this.error = '';
    this.api.getMine(this.page, this.pageSize).subscribe({
      next: r => {
        this.loading.set(false);
        this.items = r.items;
      },
      error: e => { this.error = 'Liste alınamadı'; this.loading.set(false); console.error(e); }
    });
  }

  addArticle() {
    this.router.navigate(['/new-article']).then(r => {

    });
  }

  getStatusInfo(s:number){
    switch(s){
      case 0: return { text:'Taslak', color:'#e0e7ff', textColor:'#1e3a8a' };
      case 1: return { text:'Gönderildi', color:'#dbeafe', textColor:'#1d4ed8' };
      case 2: return { text:'İncelemede', color:'#fef3c7', textColor:'#92400e' };
      case 3: return { text:'Onaylandı', color:'#dcfce7', textColor:'#166534' };
      case 4: return { text:'Reddedildi', color:'#fee2e2', textColor:'#991b1b' };
      case 5: return { text:'Düzeltme İstendi', color:'#fef9c3', textColor:'#854d0e' };
      default: return { text:'Bilinmiyor', color:'#e5e7eb', textColor:'#374151' };
    }
  }

  goUpdateArticle(selectedItemId:string){
    this.router.navigate(['/update-article',selectedItemId]).then(r => {});
  }
}
