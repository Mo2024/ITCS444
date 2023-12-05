import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HallService } from '../hall.service';
import { AlertController, NavController } from '@ionic/angular';
import { Hall } from '../create-hall/create-hall.page';
import { onAuthStateChanged } from 'firebase/auth';
import { Timestamp, collection, getDocs, query, where } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

interface reservedDate {
  date: string,
  isReserved: boolean
}
@Component({
  selector: 'app-view-hall',
  templateUrl: './view-hall.page.html',
  styleUrls: ['./view-hall.page.scss'],
})
export class ViewHallPage implements OnInit {
  userType: string = ''
  uid: string = ''
  isUpdating = false
  dateArray: reservedDate[] = [];
  hall: Hall = {}
  nameRegex: string = '^[a-zA-Z0-9\\s-]+$';
  capacityRegex: string = '^[1-9]\\d*$';
  numberOfBoothsRegex: string = '^[1-9]\\d*$';
  emailRegex: string = '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  requestedHalls: any[] = []
  reservedDates: any[] | undefined
  constructor(private navCtrl: NavController, public firestore: Firestore, public auth: Auth, private alertController: AlertController, private activatedRoute: ActivatedRoute, public hallServ: HallService) { }

  async ngOnInit() {
    await this.checkAuthState();

    let id = this.activatedRoute.snapshot.paramMap.get('id')
    try {
      this.hall = await this.hallServ.getHall(id) as Hall
      this.hall.reservedDates?.forEach((hallDate) => {
        this.requestedHalls.push(hallDate);
      })

      this.update7Days()
      console.log(this.dateArray)
    } catch (error) {
      await this.presentAlert('Error occured', 'error occured in viewing the hall');
    }
  }

  update7Days() {
    let currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      let timestamp = currentDate.getTime();
      let nextDate = new Date(timestamp);
      let stringedDate = nextDate.toDateString()
      let isReserved = false
      this.requestedHalls.map((date: any) => {
        let reservedDate = (new Date(date.seconds * 1000)).toDateString()
        if (stringedDate == reservedDate) {
          isReserved = true
          this.dateArray.push({ date: stringedDate, isReserved: true });
        }

      })
      if (!isReserved) {
        this.dateArray.push({ date: stringedDate, isReserved: false });
      }
      currentDate.setDate(currentDate.getDate() + 1);
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
  async reserveHall() {
    const today = new Date();
    let disabledDates: string[] = []
    this.hall?.reservedDates?.forEach((date: any) => {
      const formattedDate = new Date(date.seconds * 1000).toDateString();
      disabledDates.push(formattedDate);
    });
    console.log(disabledDates)

    const alert = await this.alertController.create({
      header: 'Select Reservation Date',
      inputs: [
        {
          name: 'selectedDate',
          type: 'date',
          min: today.toISOString().split('T')[0], // Set the minimum allowed date
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Reserve',
          handler: async (data) => {
            try {
              let selectedDate = new Date(data.selectedDate).toDateString()
              let alreadyReserved = await this.hallServ.checkIfAlreadyReserved(this.hall.id as string, new Date(data.selectedDate), this.uid as string)

              if (disabledDates.includes(selectedDate)) {
                await this.presentAlert('Invalid Reservation', 'Chosen date is already reserved')
              } else if (alreadyReserved) {
                await this.presentAlert('Invalid Reservation', 'Reservation request is still pending')
              }
              else {
                await this.hallServ.requestHallReservation(this.hall.id as string, new Date(data.selectedDate), this.uid as string)
              }
            } catch (error) {
              console.log(error)
            }


          },
        },
      ],
    });

    await alert.present();
  }


  async checkAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      const q = query(collection(this.firestore, "Users"), where("email", "==", user?.email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];

      this.userType = doc.data()['userType']
      this.uid = user?.uid as string
    });
  }

  getMinDisabledDate(dates: any) {
    return dates.length > 0 ? dates.reduce((min: any, date: any) => (date < min ? date : min)) : null;
  }

  getMaxDisabledDate(dates: any) {
    return dates.length > 0 ? dates.reduce((max: any, date: any) => (date > max ? date : max)) : null;
  }

  updateHall() {
    this.isUpdating = true

  }
  async saveHall() {
    try {
      let name = this.hall.name as string

      if (!name.match(this.nameRegex)) {
        await this.presentAlert('Invalid Credentials', 'Invalid name');
        return;
      }

      let cap = this.hall.capacity as number

      if (!cap.toString().match(this.capacityRegex)) {
        await this.presentAlert('Invalid Credentials', 'Invalid capacity');
        return;
      }

      let no = this.hall.numberOfBoothsFitting as number

      if (!no.toString().match(this.numberOfBoothsRegex)) {
        await this.presentAlert('Invalid Credentials', 'Invalid number of booths fitting');
        return;
      }
      let BDTeamContact = this.hall.BDTeamContact as string

      if (!BDTeamContact.match(this.emailRegex)) {
        await this.presentAlert('Invalid Credentials', 'Invalid BD Team Contact email');
        return;
      }
      await this.hallServ.updateHall(this.hall)
      this.isUpdating = false

    } catch (error) {
      await this.presentAlert('Error occured', 'error occured in saving the hall');

    }

  }
  async deleteHall(id: any) {
    console.log(id)
    try {
      await this.hallServ.deleteHall(id)
      this.navCtrl.pop();

    } catch (error) {
      console.log(error)
      await this.presentAlert('Error occured', 'error occured in makingg the hall');
    }
  }
}
