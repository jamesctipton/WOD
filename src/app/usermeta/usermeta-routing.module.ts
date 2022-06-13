import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsermetaPage } from './usermeta.page';

const routes: Routes = [
  {
    path: '',
    component: UsermetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsermetaPageRoutingModule {}
