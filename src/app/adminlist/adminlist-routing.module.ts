import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminlistPage } from './adminlist.page';

const routes: Routes = [
  {
    path: '',
    component: AdminlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminlistPageRoutingModule {}
