import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public authServ: AuthService, private router: Router) { }

  async signOut() {
    await this.authServ.signOut();
    this.router.navigate(['/login']);
  }
}
