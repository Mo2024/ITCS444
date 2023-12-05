import { Component, OnInit } from '@angular/core';
import { HallService } from '../hall.service';

@Component({
  selector: 'app-requested-reservation',
  templateUrl: './requested-reservation.page.html',
  styleUrls: ['./requested-reservation.page.scss'],
})
export class RequestedReservationPage implements OnInit {

  requestedHalls: any[] = []

  constructor(public hallServ: HallService) { }

  async ngOnInit() {
    this.requestedHalls = await this.hallServ.getRequestedReservedHalls() as any
    console.log(this.requestedHalls)
  }

}
