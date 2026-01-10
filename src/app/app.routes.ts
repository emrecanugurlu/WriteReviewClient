import {Routes} from '@angular/router';
import {Home} from './components/home/home';


import {UpdateArticle} from './components/update-article/update-article';
import {authGuard} from './guards/auth-guard';
import {AdminLayout} from './pages/admin/components/admin-layout/admin-layout';
import {Articles} from './pages/admin/components/articles/articles';
import {ExpertiseAreas} from './pages/admin/components/expertise-areas/expertise-areas';
import {Users} from './pages/admin/components/users/users';
import {ArticleDetail} from './pages/manager/components/article-detail/article-detail';
import {Login} from './pages/common/login/login';
import {MyArticles} from './pages/author/components/my-articles/my-articles';
import {AddArticle} from './pages/author/components/add-article/add-article';
import {ManagerPanel} from './pages/manager/components/manager-panel/manager-panel';
import { Profile } from './pages/common/profile/profile';
import { ExpertPanel } from './pages/expert/components/expert-panel/expert-panel';
import { AssignedArticleDetail } from './pages/expert/components/assigned-article-detail/assigned-article-detail';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'new-article', component: AddArticle, canActivate:[authGuard]},
  {path: 'login', component: Login},
  {path: 'my-articles', component: MyArticles, canActivate:[authGuard]},
  {path: 'update-article/:id', component: UpdateArticle, canActivate:[authGuard]},
  {path: 'profile', component: Profile, canActivate:[authGuard]},
  {path: 'home', component: Home},
  {path: 'manager-panel', component: ManagerPanel, canActivate:[authGuard]},
  {path: 'article-detail/:id', component: ArticleDetail, canActivate:[authGuard]},
  {path: 'expert-panel', component: ExpertPanel, canActivate:[authGuard]},
  {path: 'assigned-article-detail/:id', component: AssignedArticleDetail, canActivate:[authGuard]},
  {
    path: 'admin',component:AdminLayout, children:[
      {path: 'articles', component: Articles},
      {path: 'expertise-areas', component: ExpertiseAreas},
      {path: 'users', component: Users},
    ],canActivate:[authGuard]},
];
