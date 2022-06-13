import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsermetaPageRoutingModule } from './usermeta-routing.module';

import { UsermetaPage } from './usermeta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsermetaPageRoutingModule
  ],
  declarations: [UsermetaPage]
})
export class UsermetaPageModule {}
