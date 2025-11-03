import {Routes} from '@angular/router';
import {Login} from './components/login/login';
import {Home} from './components/home/home';
import {MyArticles} from './components/my-articles/my-articles';
import NewArticle from './components/new-article/new-article';
import {UpdateArticle} from './components/update-article/update-article';
import {Profile} from './components/profile/profile';
import StaffInbox from './components/staff-inbox/staff-inbox';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'new-article', component: NewArticle},
  {path: 'login', component: Login},
  {path: 'my-articles', component: MyArticles},
  {path: 'update-article/:id', component: UpdateArticle},
  {path: 'profile', component: Profile},
  {path: 'home', component: Home},
  { path: 'staff/inbox', component: StaffInbox },
];
