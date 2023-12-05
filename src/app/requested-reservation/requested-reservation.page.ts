import { Component, OnInit } from '@angular/core';
import { HallService } from '../hall.service';

@Component({
  selector: 'app-requested-reservation',
  templateUrl: './requested-reservation.page.html',
  styleUrls: ['./requested-reservation.page.scss'],
})
export class RequestedReservationPage implements OnInit {

  requestedHalls: any[] = []
  combinedRequestedHalls: any[] = []


  constructor(public hallServ: HallService) { }

  async ngOnInit() {
    this.requestedHalls = await this.hallServ.getRequestedHalls() as any
    this.requestedHalls.map(async (requestedHall: any, index: number) => {
      let user = await this.hallServ.getUserInfo(requestedHall.uid) as any
      let hall = await this.hallServ.getHall(requestedHall.hallId as string) as any
      let combinedInfo = {
        ...requestedHall,
        userName: user?.name,
        email: user?.email,
        hallName: hall?.name
      }
      this.combinedRequestedHalls.push(combinedInfo)
    })
  }
  formatDate(date: { seconds: number, nanoseconds: number }): string {
    // Implement your date formatting logic
    return new Date(date.seconds * 1000).toLocaleDateString();
  }

  rejectRequest(hall: any): void {
    // Implement reject logic
  }

  approveRequest(hall: any): void {
    // Implement approve logic
  }
}
