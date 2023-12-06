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
  confirmPwd: string = '';
  accountType: string = '';
  name = ''
  passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  fullNameRegex = /^[A-Z][a-z]*\s[A-Z][a-z]*$/;
  accountTypeRegex = /\b(client|attendee)\b/;

  constructor(public authServ: AuthService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    console.log('signup ppage')
  }
  async signup() {

    if (!this.emailPattern.test(this.email)) {
      await this.presentAlert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    if (this.password !== this.confirmPwd) {
      await this.presentAlert('Invalid Password', "Password do not match!");
      return;

    }
    if (!this.fullNameRegex.test(this.name)) {
      await this.presentAlert('Invalid Full Name', "Please enter full name properly");
    }
    if (!this.passwordRegex.test(this.password)) {
      await this.presentAlert('Invalid Password', "Password does not meet the requirements");
      return;

    }
    if (!this.accountTypeRegex.test(this.accountType)) {
      await this.presentAlert('Invalid Account Type', "Chosen account type is invalid");
      return;

    }


    try {
      const user = await this.authServ.signUp(this.email, this.password, this.accountType, this.name);
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
