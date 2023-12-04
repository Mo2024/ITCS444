import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '../auth.service';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-halls',
  templateUrl: './halls.page.html',
  styleUrls: ['./halls.page.scss'],
})
export class HallsPage implements OnInit {

  userType: string = ''
  constructor(public auth: Auth, authServ: AuthService, public firestore: Firestore) { }

  ngOnInit() {
    this.checkAuthState();

  }
  async checkAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      const q = query(collection(this.firestore, "Users"), where("email", "==", user?.email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];

      this.userType = doc.data()['userType']
    });
  }

  createHalls() {

  }

}
