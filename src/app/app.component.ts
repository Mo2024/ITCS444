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
        this.router.navigate(['/create-event/fc6f5ea3-9dbf-49da-9a6f-b6e05ef105e3']);
        // this.router.navigate(['/halls']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
