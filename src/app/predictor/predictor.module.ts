import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PredictorPageRoutingModule } from './predictor-routing.module';

import { PredictorPage } from './predictor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PredictorPageRoutingModule
  ],
  declarations: [PredictorPage]
})
export class PredictorPageModule {}
