import { Routes } from '@angular/router';



import { authGuard } from './guards/auth-guard';
import { AdminLayout } from './pages/admin/components/admin-layout/admin-layout';
import { Articles } from './pages/admin/components/articles/articles';
import { ExpertiseAreas } from './pages/admin/components/expertise-areas/expertise-areas';
import { Users } from './pages/admin/components/users/users';
import { ArticleDetail } from './pages/manager/components/article-detail/article-detail';
import { Login } from './pages/common/login/login';
import { MyArticles } from './pages/author/components/my-articles/my-articles';
import { AddArticle } from './pages/author/components/add-article/add-article';
import { ManagerPanel } from './pages/manager/components/manager-panel/manager-panel';
import { Profile } from './pages/common/profile/profile';
import { ExpertPanel } from './pages/expert/components/expert-panel/expert-panel';
import { AssignedArticleDetail } from './pages/expert/components/assigned-article-detail/assigned-article-detail';
import { ArticleDetail as AuthorArticleDetail } from './pages/author/components/article-detail/article-detail';
import { AdminDashboard } from './pages/admin/components/dashboard/dashboard';
import { ManagerProfile } from './pages/manager/components/manager-profile/manager-profile';
import { ExpertProfile } from './pages/expert/components/expert-profile/expert-profile';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'new-article', component: AddArticle, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'my-articles', component: MyArticles, canActivate: [authGuard] },
  { path: 'my-article-detail/:id', component: AuthorArticleDetail, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  { path: 'manager-panel', component: ManagerPanel, canActivate: [authGuard] },
  { path: 'manager-profile', component: ManagerProfile, canActivate: [authGuard] },
  { path: 'article-detail/:id', component: ArticleDetail, canActivate: [authGuard] },
  { path: 'expert-panel', component: ExpertPanel, canActivate: [authGuard] },
  { path: 'expert-profile', component: ExpertProfile, canActivate: [authGuard] },
  { path: 'assigned-article-detail/:id', component: AssignedArticleDetail, canActivate: [authGuard] },
  {
    path: 'admin', component: AdminLayout, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'articles', component: Articles },
      { path: 'expertise-areas', component: ExpertiseAreas },
      { path: 'users', component: Users },
    ], canActivate: [authGuard]
  },
];
