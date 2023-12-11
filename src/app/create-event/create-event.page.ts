import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { HallService } from '../hall.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {
  eid: string = '';

  constructor(private eventServ: EventService, private navCtrl: NavController, public firestore: Firestore, public auth: Auth, private alertController: AlertController, private activatedRoute: ActivatedRoute, public hallServ: HallService) { }
  userType: string = ''
  uid: string = ''

  selectedFile: File | null = null;

  agenda: string = ''
  speaker: string = ''
  speakers: string[] = []
  update: string = ''
  updates: string[] = []
  dragAndDrop: string[] = [
    'imageInnerHTML',
    'agendaInnerHTML',
    'speakersInnerHTML',
    'exhibitionInnerHTML',
    'registration',
    'attendees',
    'updatesInnerHTML',
  ]


  async ngOnInit() {
    await this.checkAuthState();
    this.eid = this.activatedRoute.snapshot.paramMap.get('id') as string

  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && this.isImage(file)) {
      this.selectedFile = file;
    } else {
      // Handle non-image file selection
      await this.presentAlert('Error occured', 'Please select a valid image file.');

    }
  }


  async CreateEvent() {
    let finalSpeakers = [this.speaker, ...this.speakers]
    let finalUpdates = [this.update, ...this.updates]

    try {

      if (this.isValid()) {
        let eventDetails = {
          agenda: this.agenda,
          speakers: finalSpeakers,
          updates: finalUpdates,
          dragAndDrop: this.dragAndDrop

        }
        await this.eventServ.createEvent(eventDetails, this.selectedFile, this.eid)
        this.navCtrl.pop();

      }



    } catch (error) {
      await this.presentAlert('Error occured', 'error occured in making the event');
    }

  }
  isImage(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

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

  isValid(): boolean {
    // Regular expressions for validation
    const agendaRegex = /^[a-zA-Z0-9\s]+$/; // Alphanumeric with spaces
    const speakerRegex = /^[a-zA-Z\s]+$/; // Only alphabets with spaces
    const updateRegex = /^[a-zA-Z0-9\s]+$/; // Alphanumeric with spaces

    // Validate agenda
    if (!agendaRegex.test(this.agenda)) {
      this.presentAlert('Invalid Input', 'Please enter a valid agenda.');
      return false;
    }

    // Validate speaker
    if (!speakerRegex.test(this.speaker)) {
      this.presentAlert('Invalid Input', 'Please enter a valid speaker name.');
      return false;
    }

    // Validate update
    if (!updateRegex.test(this.update)) {
      this.presentAlert('Invalid Input', 'Please enter a valid update.');
      return false;
    }

    for (const speaker of this.speakers) {
      if (!speakerRegex.test(speaker)) {
        this.presentAlert('Invalid Input', `Invalid speaker name of ${speaker}`);
        return false;
      }
    }

    // Validate updates array
    for (const update of this.updates) {
      if (!updateRegex.test(update)) {
        this.presentAlert('Invalid Input', `Invalid update of ${update}`);
        return false;
      }
    }

    // If all validations pass
    return true;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
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
