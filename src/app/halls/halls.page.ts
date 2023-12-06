import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '../auth.service';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Hall } from '../create-hall/create-hall.page';
import { HallService } from '../hall.service';
import { AlertController, NavController } from '@ionic/angular';
import { v4 } from 'uuid';


@Component({
  selector: 'app-halls',
  templateUrl: './halls.page.html',
  styleUrls: ['./halls.page.scss'],
})
export class HallsPage implements OnInit {

  userType: string = ''
  filteredHalls: Hall[] = [];


  public halls$: Observable<Hall[]> | undefined;

  filterType: string = 'none';
  selectedDate: Date | undefined;
  selectedCapacity: number | undefined;
  halls: any[] = []
  uid: any;
  myReservations: any[] = []
  constructor(public authServ: AuthService, public auth: Auth, private router: Router, public hallServ: HallService, public firestore: Firestore, private alertController: AlertController,) { }

  ngOnInit() {
    this.checkAuthState();
    this.getHalls();
  }

  onDeleteIconClick() {
    this.filterType = 'none';
    this.filteredHalls = []
  }
  logout() {
    this.authServ.signOut()
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

  async onFilterTypeChange() {
    const today = new Date();
    if (this.filterType == 'available' || this.filterType == 'reserved') {
      const alert = await this.alertController.create({
        header: 'Select Date',
        inputs: [
          {
            name: 'date',
            type: 'date',
            min: today.toISOString().split('T')[0]
            // value // Set the initial value if available
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'OK',
            handler: async (data) => {
              if (this.filterType == 'available') {
                this.filteredHalls = await this.hallServ.getAvailableDateHall(data) as any[]

              } else if (this.filterType == 'reserved') {

                this.filteredHalls = await this.hallServ.getReservedDateHall(data) as any[]
              }
            }
          }
        ]
      });

      await alert.present();
    } else if (this.filterType == 'capacity') {
      const capacityAlert = await this.alertController.create({
        header: 'Enter Capacity',
        inputs: [
          {
            name: 'capacity',
            type: 'number',
            min: 1, // Set the minimum value
            placeholder: 'Enter a positive number'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'OK',
            handler: async (data) => {
              const enteredCapacity = parseInt(data.capacity, 10);
              if (!isNaN(enteredCapacity) && enteredCapacity > 0) {

                console.log(enteredCapacity)
                this.filteredHalls = await this.hallServ.getCapacityHall(enteredCapacity) as any[]

              } else {
                // Reprompt if the input is invalid
                await this.onFilterTypeChange();
              }
            }
          }
        ]
      });

      await capacityAlert.present();
    }
  }


  // Assuming myReservations is an array of reservation objects

  async createEvent() {
    let date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    date = new Date(year, month, day);

    this.myReservations = await this.hallServ.getMyReservations(date, this.uid) as any[]

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
            // Do something with the selected reservation
          }
        }
      ]
    });

    await alert.present();
  }

  async getHalls() {
    const q = query(collection(this.firestore, 'Halls'));
    this.halls$ = collectionData(q, { idField: 'id', }) as Observable<Hall[]>;
  }

  createHalls() {
    this.router.navigate(['/create-hall']);

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
