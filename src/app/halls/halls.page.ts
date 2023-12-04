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


@Component({
  selector: 'app-halls',
  templateUrl: './halls.page.html',
  styleUrls: ['./halls.page.scss'],
})
export class HallsPage implements OnInit {

  userType: string = ''
  public halls$: Observable<Hall[]> | undefined;

  constructor(public auth: Auth, private router: Router, public hallServ: HallService, public firestore: Firestore, private alertController: AlertController,) { }

  ngOnInit() {
    this.checkAuthState();
    this.getHalls();
  }
  async checkAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      const q = query(collection(this.firestore, "Users"), where("email", "==", user?.email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];

      this.userType = doc.data()['userType']
    });
  }

  async getHalls() {
    const q = query(collection(this.firestore, 'Halls'));
    this.halls$ = collectionData(q, { idField: 'id', }) as Observable<Hall[]>;
  }

  createHalls() {
    this.router.navigate(['/create-hall']);

  }

  async deleteHall(id: any) {
    console.log('id')
    try {
      // await this.hallServ.deleteHall(id)

      console.log(this.halls$)
    } catch (error) {
      await this.presentAlert('Error occured', 'error occured in makingg the hall');
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
