import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminlistPageRoutingModule } from './adminlist-routing.module';

import { AdminlistPage } from './adminlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminlistPageRoutingModule
  ],
  declarations: [AdminlistPage]
})
export class AdminlistPageModule {}
