import {Routes} from '@angular/router';
import {Login} from './components/login/login';
import {Home} from './components/home/home';
import {MyArticles} from './components/my-articles/my-articles';
import NewArticle from './components/new-article/new-article';
import {UpdateArticle} from './components/update-article/update-article';
import {Profile} from './components/profile/profile';
import StaffInbox from './pages/manager/components/staff-inbox/staff-inbox';
import {authGuard} from './guards/auth-guard';
import {AdminLayout} from './pages/admin/components/admin-layout/admin-layout';
import {Articles} from './pages/admin/components/articles/articles';
import {ExpertiseAreas} from './pages/admin/components/expertise-areas/expertise-areas';
import {Users} from './pages/admin/components/users/users';

import {AssignedArticles} from './pages/expert/assigned-articles/assigned-articles';
import {ArticleDetail} from './pages/manager/components/article-detail/article-detail';
import {AssignedArticleDetail} from './pages/expert/assigned-article-detail/assigned-article-detail';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'new-article', component: NewArticle, canActivate:[authGuard]},
  {path: 'login', component: Login},
  {path: 'my-articles', component: MyArticles, canActivate:[authGuard]},
  {path: 'update-article/:id', component: UpdateArticle, canActivate:[authGuard]},
  {path: 'profile', component: Profile, canActivate:[authGuard]},
  {path: 'home', component: Home},
  {path: 'staff/inbox', component: StaffInbox, canActivate:[authGuard]},
  {path: 'article-detail/:id', component: ArticleDetail, canActivate:[authGuard]},
  {path: 'assigned-articles', component: AssignedArticles, canActivate:[authGuard]},
  {path: 'assigned-article-detail/:id', component: AssignedArticleDetail, canActivate:[authGuard]},
  {
    path: 'admin',component:AdminLayout, children:[
      {path: 'articles', component: Articles},
      {path: 'expertise-areas', component: ExpertiseAreas},
      {path: 'users', component: Users},
    ],canActivate:[authGuard]},
];
