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

  hall: Hall = {}
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
