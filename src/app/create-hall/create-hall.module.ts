import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateHallPageRoutingModule } from './create-hall-routing.module';

import { CreateHallPage } from './create-hall.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateHallPageRoutingModule
  ],
  declarations: [CreateHallPage]
})
export class CreateHallPageModule {}
