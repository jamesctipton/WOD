import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SamplePageRoutingModule } from './sample-routing.module';

import { SamplePage } from './sample.page';

import { AppleMapsModule } from 'ngx-apple-maps';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SamplePageRoutingModule,
    AppleMapsModule
  ],
  declarations: [SamplePage]
})
export class SamplePageModule {}
