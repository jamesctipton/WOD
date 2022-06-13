import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminlogPage } from './adminlog.page';

const routes: Routes = [
  {
    path: '',
    component: AdminlogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminlogPageRoutingModule {}
