import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateHallPage } from './create-hall.page';

const routes: Routes = [
  {
    path: '',
    component: CreateHallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateHallPageRoutingModule {}
