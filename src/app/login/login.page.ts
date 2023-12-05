import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  constructor(public authServ: AuthService, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
    console.log('login ppage')
  }

  async login() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      await this.presentAlert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    try {
      await this.authServ.signIn(this.email, this.password);
      this.router.navigate(['/halls']);
    } catch (error) {
      await this.presentAlert('Invalid Credentials', 'Invalid username or password');
      console.error('Sign-in error:', error);
    }
  }


  navigateToRegisterPage() {
    console.log('work')
    this.router.navigate(['/signup']);
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
