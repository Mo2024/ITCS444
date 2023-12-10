import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

  constructor(private navCtrl: NavController, private alertController: AlertController, private eventServ: EventService, private activatedRoute: ActivatedRoute) { }

  event: any
  id: string = ''

  agenda: string = ''
  speaker: string = ''
  speakers: string[] = []
  update: string = ''
  updates: string[] = []
  dragAndDrop: object[] = []
  selectedFile: File | null = null;

  async ngOnInit() {
    this.id = await this.activatedRoute.snapshot.paramMap.get('id') as string
    this.event = await this.eventServ.getEvent(this.id as string)
    this.speaker = this.event.eventDetails.speakers.shift()
    this.speakers = this.event.eventDetails.speakers
    this.update = this.event.eventDetails.updates.shift()
    this.updates = this.event.eventDetails.updates
    this.agenda = this.event.eventDetails.agenda
    this.dragAndDrop = this.event.eventDetails.dragAndDrop
    console.log(this.event)
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
  async EditEvent() {

    let finalSpeakers = [this.speaker, ...this.speakers]
    let finalUpdates = [this.update, ...this.updates]

    try {

      if (this.isValid()) {
        let eventDetails = {
          agenda: this.agenda,
          speakers: finalSpeakers,
          updates: finalUpdates,
          dragAndDrop: this.dragAndDrop,
          posterUrl: this.event.eventDetails.posterUrl,
        }
        this.event = {
          ...this.event,
          eventDetails
        }
        await this.eventServ.editEvent(this.event, this.selectedFile, this.id)
        await this.presentAlert('Success', 'Event edited successfully');


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

}
