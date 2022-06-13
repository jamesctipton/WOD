import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmininfoPageRoutingModule } from './admininfo-routing.module';

import { AdmininfoPage } from './admininfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmininfoPageRoutingModule
  ],
  declarations: [AdmininfoPage]
})
export class AdmininfoPageModule {}
