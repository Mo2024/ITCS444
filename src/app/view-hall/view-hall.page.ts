import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HallService } from '../hall.service';
import { AlertController, NavController } from '@ionic/angular';
import { Hall } from '../create-hall/create-hall.page';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-view-hall',
  templateUrl: './view-hall.page.html',
  styleUrls: ['./view-hall.page.scss'],
})
export class ViewHallPage implements OnInit {
  userType: string = ''

  isUpdating = false
  hall: Hall = {}
  nameRegex: string = '^[a-zA-Z0-9\\s-]+$';
  capacityRegex: string = '^[1-9]\\d*$';
  numberOfBoothsRegex: string = '^[1-9]\\d*$';
  emailRegex: string = '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';

  constructor(private navCtrl: NavController, public firestore: Firestore, public auth: Auth, private alertController: AlertController, private activatedRoute: ActivatedRoute, public hallServ: HallService) { }

  async ngOnInit() {
    this.checkAuthState();

    let id = this.activatedRoute.snapshot.paramMap.get('id')
    try {
      this.hall = await this.hallServ.getHall(id) as Hall
    } catch (error) {
      await this.presentAlert('Error occured', 'error occured in viewing the hall');
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
  async checkAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      const q = query(collection(this.firestore, "Users"), where("email", "==", user?.email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];

      this.userType = doc.data()['userType']
    });
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
