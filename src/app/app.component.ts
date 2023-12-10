import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private router: Router, public auth: Auth) {
    // You can move the logic to the constructor or another method
    this.checkAuthState();
  }

  checkAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // this.router.navigate(['/edit-event/nMpbnOx3p1FpTJFX7CMt']);
        this.router.navigate(['/halls']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
