import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminsearchPageRoutingModule } from './adminsearch-routing.module';

import { AdminsearchPage } from './adminsearch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminsearchPageRoutingModule
  ],
  declarations: [AdminsearchPage]
})
export class AdminsearchPageModule {}
