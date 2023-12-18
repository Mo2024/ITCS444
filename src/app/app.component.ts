import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private router: Router, public auth: Auth, public authSer: AuthService) {
    // You can move the logic to the constructor or another method
    this.checkAuthState();
  }

  async checkAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        let userFetched = await this.authSer.getUser(user.uid) as any
        if (userFetched?.userType == 'attendee') {
          this.router.navigate(['/events']);
        } else {
          this.router.navigate(['/halls']);
          // this.router.navigate(['/view-event/rvl8GUFJzcLL94G0FyAw']);

        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
