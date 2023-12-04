import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HallService } from '../hall.service';
import { AlertController } from '@ionic/angular';
import { Hall } from '../create-hall/create-hall.page';

@Component({
  selector: 'app-view-hall',
  templateUrl: './view-hall.page.html',
  styleUrls: ['./view-hall.page.scss'],
})
export class ViewHallPage implements OnInit {

  hall: Hall = {}
  constructor(private alertController: AlertController, private activatedRoute: ActivatedRoute, public hallServ: HallService) { }

  async ngOnInit() {
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
}
