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
    await this.getReservationsRequests()
  }

  async getReservationsRequests(removedHallRequests?: object) {

    // this.combinedRequestedHalls = []

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

  // async removeRejectedHalls(removedHallRequests: object) {


  // }
  formatDate(date: { seconds: number, nanoseconds: number }): string {
    // Implement your date formatting logic
    return new Date(date.seconds * 1000).toLocaleDateString();
  }

  async rejectRequest(hall: any) {
    // Implement approve logic
    try {
      let date = new Date(hall.reservationDate.seconds * 1000)

      let result = await this.hallServ.rejectReservation(hall.hallId, date, hall.uid)
      if (result) {

        // await this.getReservationsRequests({ hallId: hall.hallId, date });
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const newReservationDate = new Date(year, month, day).toDateString()
        this.combinedRequestedHalls = this.combinedRequestedHalls.filter(request => {
          let reqDate = new Date(request.reservationDate.seconds * 1000)

          const year = reqDate.getFullYear();
          const month = reqDate.getMonth();
          const day = reqDate.getDate();
          // console.log(request.uid)
          // console.log(request.uid)
          let reqDateString = new Date(year, month, day).toDateString() as string
          return !(request.uid === hall.uid && reqDateString == newReservationDate);
        });
      }
    } catch (error) {

    }
  }

  async approveRequest(hall: any) {
    // Implement approve logic
    try {
      let date = new Date(hall.reservationDate.seconds * 1000)

      let result = await this.hallServ.approveReservation(hall.hallId, date, hall.uid)
      if (result) {

        // await this.getReservationsRequests({ hallId: hall.hallId, date });
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const newReservationDate = new Date(year, month, day).toDateString()
        this.combinedRequestedHalls = this.combinedRequestedHalls.filter(request => {
          let reqDate = new Date(request.reservationDate.seconds * 1000)

          const year = reqDate.getFullYear();
          const month = reqDate.getMonth();
          const day = reqDate.getDate();

          let reqDateString = new Date(year, month, day).toDateString() as string
          return !(request.hallId === hall.hallId && reqDateString == newReservationDate);
        });
      }
    } catch (error) {

    }
  }
}
