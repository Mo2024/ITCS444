import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  validationError: string = '';
  constructor(public authServ: AuthService) { }

  ngOnInit() {
    console.log('login ppage')
  }

  login() {
    // Basic email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      this.validationError = 'Please enter a valid email address';
      return;
    }

    this.authServ.signIn(this.email, this.password)

  }

  navigateToRegisterPage() {

  }
}
