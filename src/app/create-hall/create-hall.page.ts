import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { HallService } from '../hall.service';

export interface Hall {
  id?: string
  name: string;
  capacity: number;
  numberOfBoothsFitting: number;
  BDTeamContact: string;
}

@Component({
  selector: 'app-create-hall',
  templateUrl: './create-hall.page.html',
  styleUrls: ['./create-hall.page.scss'],
})
export class CreateHallPage implements OnInit {

  name: string = '';
  capacity: number | undefined;
  numberOfBoothsFitting: number | undefined
  BDTeamContact: string = ''

  nameRegex: string = '^[a-zA-Z0-9\\s-]+$';
  capacityRegex: string = '^[1-9]\\d*$';
  numberOfBoothsRegex: string = '^[1-9]\\d*$';
  emailRegex: string = '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';

  constructor(private alertController: AlertController, public hallServ: HallService, private navCtrl: NavController) { }

  async createHalls() {
    if (!this.name.match(this.nameRegex)) {
      await this.presentAlert('Invalid Credentials', 'Invalid name');
      return;
    }

    let cap = this.capacity as number

    if (!cap.toString().match(this.capacityRegex)) {
      await this.presentAlert('Invalid Credentials', 'Invalid capacity');
      return;
    }

    let no = this.numberOfBoothsFitting as number

    if (!no.toString().match(this.numberOfBoothsRegex)) {
      await this.presentAlert('Invalid Credentials', 'Invalid number of booths fitting');
      return;
    }

    if (!this.BDTeamContact.match(this.emailRegex)) {
      await this.presentAlert('Invalid Credentials', 'Invalid BD Team Contact email');
      return;
    }

    try {
      await this.hallServ.createHall({
        name: this.name,
        capacity: this.capacity,
        numberOfBoothsFitting: this.numberOfBoothsFitting,
        BDTeamContact: this.BDTeamContact,
      })

      this.navCtrl.pop();

    } catch (error) {
      await this.presentAlert('Error occured', 'error occured in makingg the hall');
    }

  }

  ngOnInit() {
    console.log('create hall')
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
