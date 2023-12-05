import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  email: string = '';
  password: string = '';
  accountType: string = '';
  constructor(public authServ: AuthService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    console.log('signup ppage')
  }
  async signup() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      await this.presentAlert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    try {
      const user = await this.authServ.signUp(this.email, this.password, this.accountType);
      this.router.navigate(['/halls']);
    } catch (error) {
      await this.presentAlert('Invalid Email', 'Email already in use');
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
