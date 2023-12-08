import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { HallService } from '../hall.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

  constructor(private navCtrl: NavController, public firestore: Firestore, public auth: Auth, private alertController: AlertController, private activatedRoute: ActivatedRoute, public hallServ: HallService) { }
  userType: string = ''
  uid: string = ''

  selectedFile: File | null = null;


  agenda: string = ''
  speaker: string = ''
  speakers: string[] = []
  update: string = ''
  updates: string[] = []
  dragAndDrop: object[] = [
    {
      name: 'agenda',
      position: 0
    },
    {
      name: 'speakers',
      position: 1
    },
    {
      name: 'exhibition',
      position: 2
    },
    {
      name: 'registration',
      position: 3
    },
    {
      name: 'attendees',
      position: 4
    },
    {
      name: 'updates',
      position: 5
    },
  ]
  addSpeaker() {
    this.speakers.push('');
  }

  removeSpeaker(index: number) {
    this.speakers.splice(index, 1);
  }

  addUpdate() {
    this.updates.push('');
  }

  removeUpdate(index: number) {
    this.updates.splice(index, 1);
  }


  async ngOnInit() {
    await this.checkAuthState();
    let id = this.activatedRoute.snapshot.paramMap.get('id')
  }
  async checkAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      const q = query(collection(this.firestore, "Users"), where("email", "==", user?.email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];

      this.userType = doc.data()['userType']
      this.uid = user?.uid as string
    });
  }

}
