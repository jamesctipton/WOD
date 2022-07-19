import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'resetpass',
    loadChildren: () => import('./resetpass/resetpass.module').then( m => m.ResetpassPageModule)
  },
  {
    path: 'upload',
    loadChildren: () => import('./upload/upload.module').then( m => m.UploadPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'app',
    loadChildren: () => import('./app.module').then( m => m.AppModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sample',
    loadChildren: () => import('./sample/sample.module').then( m => m.SamplePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'adminlist',
    loadChildren: () => import('./adminlist/adminlist.module').then( m => m.AdminlistPageModule),
    canActivate: [AuthGuard, RoleGuard]
  },
  {
    path: 'admininfo',
    loadChildren: () => import('./admininfo/admininfo.module').then( m => m.AdmininfoPageModule),
    canActivate: [AuthGuard, RoleGuard]
  },
  {
    path: 'adminsearch',
    loadChildren: () => import('./adminsearch/adminsearch.module').then( m => m.AdminsearchPageModule),
    canActivate: [AuthGuard, RoleGuard]
  },
  {
    path: 'usermeta',
    loadChildren: () => import('./usermeta/usermeta.module').then( m => m.UsermetaPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
