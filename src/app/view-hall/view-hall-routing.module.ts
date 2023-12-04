import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewHallPage } from './view-hall.page';

const routes: Routes = [
  {
    path: '',
    component: ViewHallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewHallPageRoutingModule {}
