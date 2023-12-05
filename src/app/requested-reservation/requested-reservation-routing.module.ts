import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestedReservationPage } from './requested-reservation.page';

const routes: Routes = [
  {
    path: '',
    component: RequestedReservationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestedReservationPageRoutingModule {}
