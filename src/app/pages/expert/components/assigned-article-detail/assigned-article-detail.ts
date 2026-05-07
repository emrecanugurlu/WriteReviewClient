import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import { ArticleDto } from '../../../../dto/article-dto';
import { ArticleService } from '../../../../services/article/article-service';
import { AssignedArticlesDto } from '../../../../dto/assigned-articles-dto';
import { AssignedArticeData } from '../../../../services/assigned-artice-data';
import { FormsModule } from '@angular/forms';
import { Expert } from '../../../../services/expert';
import { AssignedArticleDto } from '../../../../dto/assigned-article-dto';
import { DatePipe, NgClass } from '@angular/common';


// Tip Tanımlamaları
type DecisionType = 'accept' | 'revision' | 'reject' | null;

interface Article {
  id: string;
  title: string;
  abstract: string;
  keywords: string[];
  submissionDate: string;
  authorAlias: string; // Kör hakemlik (Blind review) için takma ad
  category: string;
  status: 'Under Review' | 'Revision' | 'Accepted' | 'Rejected';
  content: string; // HTML veya text içeriği simülasyonu
}

@Component({
  selector: 'app-assigned-article-detail',
  imports: [
    FormsModule,
    DatePipe,
    NgClass
  ],
  templateUrl: './assigned-article-detail.html',
  styleUrl: './assigned-article-detail.scss'
})
export class AssignedArticleDetail {

private expertService = inject(Expert);
private route = inject(ActivatedRoute);
private router = inject(Router);
private articleId = signal<string>("");
protected assignedArticleDetail = signal<AssignedArticleDto| null>(null);


constructor() {
  this.articleId.set(this.route.snapshot.paramMap.get('id') || "");
  this.expertService.getAssignedArticleDetail(this.articleId()).subscribe({
    next: (res) => {
      console.log('Makale detayı alındı:', res);
      this.assignedArticleDetail.set(res);
    },
    error: (err) => {
      console.error('Makale detayı alınırken hata oluştu:', err);
    }
  });
}


  // Durum Yönetimi
  activeTab = signal<'abstract' | 'fulltext'>('abstract');
  
  // Dialog State: 'accept', 'revision', 'reject' or null (kapalı)
  activeDialog = signal<DecisionType>(null);
  
  reviewNote = '';
  showToast = signal(false);
  submitting = signal(false);

  // Mock Veri
  article = signal<Article>({
    id: 'MKL-2023-482',
    title: 'Yapay Zeka Destekli Sağlık Sistemlerinde Etik Karar Verme Mekanizmaları Üzerine Bir İnceleme',
    abstract: 'Bu çalışma, modern sağlık hizmetlerinde yapay zeka (YZ) kullanımının artmasıyla birlikte ortaya çıkan etik sorunları ele almaktadır. Özellikle otonom teşhis sistemlerinin karar verme süreçlerindeki şeffaflık, hesap verebilirlik ve önyargı sorunları derinlemesine incelenmiştir. Çalışmada, 5000 hasta verisi üzerinde eğitilen bir modelin, sosyo-ekonomik değişkenlere göre nasıl farklı sonuçlar üretebileceği simüle edilmiştir. Bulgular, denetimsiz algoritmaların sağlık eşitsizliğini artırabileceğini göstermektedir. Bu bağlamda, "Explainable AI" (XAI) yöntemlerinin klinik süreçlere entegrasyonu için yeni bir protokol önerilmektedir.',
    keywords: ['Yapay Zeka', 'Tıp Etiği', 'Makine Öğrenimi', 'Sağlık Bilişimi', 'Algoritmik Önyargı'],
    submissionDate: '15 Ekim 2023',
    authorAlias: 'Anonim Yazar',
    category: 'Bilişim Etiği',
    status: 'Under Review',
    content: `
      <h2 class="text-xl font-bold mb-3 mt-6 text-slate-800">1. Giriş</h2>
      <p class="mb-4">Son yıllarda sağlık sektöründe dijitalleşme hız kazanmış, büyük veri analitiği ve makine öğrenimi teknikleri teşhis ve tedavi süreçlerinin ayrılmaz bir parçası haline gelmiştir. Ancak bu teknolojik ilerleme, beraberinde ciddi etik tartışmaları da getirmektedir.</p>
      
      <h2 class="text-xl font-bold mb-3 mt-6 text-slate-800">2. Literatür Taraması</h2>
      <p class="mb-4">Smith ve arkadaşları (2021) tarafından yapılan çalışmada, radyolojik görüntülemede kullanılan derin öğrenme modellerinin insan uzmanlardan daha hızlı sonuç verdiği, ancak "false positive" oranlarının belirli demografik gruplarda yoğunlaştığı belirtilmiştir.</p>
      <p class="mb-4">Bu durum, algoritmaların eğitildiği veri setlerinin dengesizliğinden kaynaklanmaktadır. Veri etiği, bu noktada sadece teknik bir sorun olmaktan çıkıp, sosyal adalet sorununa dönüşmektedir.</p>

      <h2 class="text-xl font-bold mb-3 mt-6 text-slate-800">3. Yöntem</h2>
      <p class="mb-4">Bu araştırmada, karma yöntem deseni kullanılmıştır. Hem nicel veri analizi (hastane kayıtları) hem de nitel görüşmeler (hekimler ve etik uzmanları) ile veri çeşitliliği sağlanmıştır.</p>
      
      <div class="my-8 p-4 bg-slate-100 border-l-4 border-slate-400 italic text-slate-600">
        "Teknoloji, hekimin yerini almak için değil, onun karar verme yetisini güçlendirmek için tasarlanmalıdır." - Katılımcı Hekim A.
      </div>

      <h2 class="text-xl font-bold mb-3 mt-6 text-slate-800">4. Bulgular</h2>
      <p class="mb-4">Analiz sonuçları, mevcut algoritmaların %65'inin karar gerekçelerini açıklayamadığını ("black box" problemi) ortaya koymuştur. Bu durum, hukuki sorumluluk açısından büyük bir risk teşkil etmektedir.</p>
      
      <h2 class="text-xl font-bold mb-3 mt-6 text-slate-800">5. Tartışma ve Sonuç</h2>
      <p class="mb-4">Yapay zeka sistemlerinin sağlık alanındaki başarısı, sadece teknik doğrulukla değil, aynı zamanda etik güvenilirlikle ölçülmelidir. Önerilen protokol, bu güveni tesis etmeyi amaçlamaktadır.</p>
    `
  });

  // Dialog İşlemleri
  openDialog(type: DecisionType) {
    this.reviewNote = ''; // Notu sıfırla
    this.activeDialog.set(type);
  }

  closeDialog() {
    this.activeDialog.set(null);
  }

  submitReview() {
    if (!this.activeDialog()) return;
    
    let status = 0;
    if (this.activeDialog() === 'accept') status = 1;
    if (this.activeDialog() === 'reject') status = 2;
    if (this.activeDialog() === 'revision') status = 3;

    this.submitting.set(true);
    this.expertService.sendFeedback(this.articleId(), this.reviewNote, status).subscribe({
      next: (res) => {
        this.submitting.set(false);
        // Dialogu kapat
        this.closeDialog();

        // Bildirim göster
        this.showToast.set(true);
        setTimeout(() => {
          this.showToast.set(false);
          this.router.navigate(['/expert-panel']);
        }, 2000); // 3 saniyeden 2 saniyeye düşürüldü
      },
      error: (err) => {
        this.submitting.set(false);
        console.error('Değerlendirme gönderilirken hata oluştu:', err);
      }
    });
  }

  getStatusLabel(status: number | undefined): string {
    switch (status) {
      case 0: return 'Değerlendirme Bekliyor';
      case 1: return 'Kabul Edildi';
      case 2: return 'Reddedildi';
      case 3: return 'Revizyon İstendi';
      default: return 'Bilinmiyor';
    }
  }
}
