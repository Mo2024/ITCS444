import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { HallService } from '../hall.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { EventService } from '../event.service';
import { Observable } from 'rxjs';

export interface Event {
  date: Date,
  eid: string,
  eventDetails: any,
  eventStatus: boolean,
  hallId: string,
  id: string,
  uid: string
}
@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  constructor(public eventServ: EventService, public authServ: AuthService, public auth: Auth, private router: Router, public hallServ: HallService, public firestore: Firestore, private alertController: AlertController,) { }

  uid: string = ''
  userType: string = ''
  myReservations: any[] = []
  public events$: Observable<Event[]> | undefined
  async ngOnInit() {
    await this.checkAuthState()
    // this.myEvents$ = await this.eventServ.getMyEvents(this.uid as string) as Observable<Event[]>
    // console.log(this.myEvents)
  }

  onContainerClick(event: any) {
    this.router.navigate([`/view-event/${event.id}`]);

  }
  async checkAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      const q = query(collection(this.firestore, "Users"), where("email", "==", user?.email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];

      let q2
      this.uid = user?.uid as string
      this.userType = doc.data()['userType']
      if (this.userType == 'client') {
        q2 = query(collection(this.firestore, 'Reservations'), where("uid", "==", user?.uid));
      } else {
        q2 = query(collection(this.firestore, 'Reservations'));
      }
      this.events$ = collectionData(q2, { idField: 'id', }) as Observable<Event[]>;
    });
  }
  editEvent(event: any) {
    this.router.navigate([`/edit-event/${event.id}`]);
  }
  customizeEvent(event: object) {

  }

  logout() {
    this.authServ.signOut()
  }
  isDateToday(date: any): boolean {
    const timestampSeconds = date.seconds;
    const timestampMilliseconds = timestampSeconds * 1000;
    const objectDate = new Date(timestampMilliseconds);

    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    today = new Date(year, month, day);
    return objectDate >= today;

  }

  async createEvent() {
    let date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    date = new Date(year, month, day);

    this.myReservations = await this.hallServ.getMyReservations(date, this.uid) as any[]

    if (this.myReservations.length > 0) {
      const alert = await this.alertController.create({
        header: 'Select Reservation',
        inputs: this.myReservations.map(reservation => ({
          name: reservation.hallId, // Use a unique identifier for each option
          type: 'radio',
          label: `${new Date(reservation.date.seconds * 1000).toDateString()} - Hall: ${reservation.hallName}`,
          value: reservation // You can use the reservation object as the value
        })),
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'OK',
            handler: (selectedReservation) => {
              this.router.navigate([`/create-event/${selectedReservation.eid}`]);
              // Do something with the selected reservation
            }
          }
        ]
      });

      await alert.present();
    } else {
      await this.presentAlert('Reservation Error', 'You do not have any reservations!')
    }

  }
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
