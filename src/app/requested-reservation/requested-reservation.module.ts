import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestedReservationPageRoutingModule } from './requested-reservation-routing.module';

import { RequestedReservationPage } from './requested-reservation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestedReservationPageRoutingModule
  ],
  declarations: [RequestedReservationPage]
})
export class RequestedReservationPageModule {}
