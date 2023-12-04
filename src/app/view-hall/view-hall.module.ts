import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewHallPageRoutingModule } from './view-hall-routing.module';

import { ViewHallPage } from './view-hall.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewHallPageRoutingModule
  ],
  declarations: [ViewHallPage]
})
export class ViewHallPageModule {}
