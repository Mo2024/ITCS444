import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { HallService } from '../hall.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  constructor(public authServ: AuthService, public auth: Auth, private router: Router, public hallServ: HallService, public firestore: Firestore, private alertController: AlertController,) { }

  uid: string = ''
  userType: string = ''
  myReservations: any[] = []
  ngOnInit() {
    this.checkAuthState()
  }

  async checkAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      const q = query(collection(this.firestore, "Users"), where("email", "==", user?.email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];

      this.uid = user?.uid as string
      this.userType = doc.data()['userType']
    });
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
              console.log('Selected Reservation:', selectedReservation);
              this.router.navigate([`/create-event/${btoa(JSON.stringify(selectedReservation))}`]);
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
