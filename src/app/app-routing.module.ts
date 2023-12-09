import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'halls',
    loadChildren: () => import('./halls/halls.module').then(m => m.HallsPageModule)
  },
  {
    path: 'create-hall',
    loadChildren: () => import('./create-hall/create-hall.module').then(m => m.CreateHallPageModule)
  },
  {
    path: 'view-hall/:id',
    loadChildren: () => import('./view-hall/view-hall.module').then(m => m.ViewHallPageModule)
  },
  {
    path: 'requested-reservation',
    loadChildren: () => import('./requested-reservation/requested-reservation.module').then(m => m.RequestedReservationPageModule)
  },
  {
    path: 'create-event/:id',
    loadChildren: () => import('./create-event/create-event.module').then(m => m.CreateEventPageModule)
  },
  {
    path: 'view-event',
    loadChildren: () => import('./view-event/view-event.module').then(m => m.ViewEventPageModule)
  },
  {
    path: 'event-details',
    loadChildren: () => import('./event-details/event-details.module').then(m => m.EventDetailsPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./events/events.module').then(m => m.EventsPageModule)
  },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
