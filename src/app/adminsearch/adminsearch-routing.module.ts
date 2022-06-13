import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsearchPage } from './adminsearch.page';

const routes: Routes = [
  {
    path: '',
    component: AdminsearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminsearchPageRoutingModule {}
