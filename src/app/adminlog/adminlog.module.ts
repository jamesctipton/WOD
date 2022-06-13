import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminlogPageRoutingModule } from './adminlog-routing.module';

import { AdminlogPage } from './adminlog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminlogPageRoutingModule
  ],
  declarations: [AdminlogPage]
})
export class AdminlogPageModule {}
