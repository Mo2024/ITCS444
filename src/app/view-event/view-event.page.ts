import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ItemReorderEventDetail, NavController } from '@ionic/angular';
import { HallService } from '../hall.service';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.page.html',
  styleUrls: ['./view-event.page.scss'],
})
export class ViewEventPage implements OnInit {

  constructor(private hallServ: HallService, private navCtrl: NavController, private alertController: AlertController, private eventServ: EventService, private activatedRoute: ActivatedRoute) { }

  imageInnerHTML: string = "<ion-card><ion-row><ion-col size='12' class='ion-text-center'>" +
    "<!-- Event Poster -->" +
    "<ion-img *ngIf='event?.eventDetails?.posterUrl' [src]='event.eventDetails.posterUrl' alt='Event Poster' class='poster'></ion-img>" +
    "<!-- Agenda -->" +
    "</ion-col></ion-row></ion-card>";

  agendaInnerHTML: string = `<ion-card>
                    <ion-row>
                      <ion-col size="12">
                        <ion-title class="agenda-title">{{ event?.eventDetails?.agenda }}</ion-title>
                      </ion-col>
                    </ion-row>
                  </ion-card>`;

  speakersInnerHTML: string = `<ion-card>
                  <ion-row>
                    <ion-col size="12">
                      <ion-list>
                        <ion-list-header class="custom-list-header">Speakers</ion-list-header>
                        <ion-item *ngFor="let speaker of event.eventDetails.speakers">{{ speaker }}</ion-item>
                      </ion-list>
                    </ion-col>
                  </ion-row>
                </ion-card>`;


  event: any
  isEditing: boolean = false
  id: string = ''

  agenda: string = ''
  speaker: string = ''
  speakers: string[] = []
  update: string = ''
  updates: string[] = []
  dragAndDrop: string[] = []
  selectedFile: File | null = null;
  deleteCurrentPoster = false
  hall: any | undefined

  async ngOnInit() {
    this.id = await this.activatedRoute.snapshot.paramMap.get('id') as string
    this.event = await this.eventServ.getEvent(this.id as string)
    let speakers = [...this.event.eventDetails.speakers]
    this.speaker = speakers.shift()
    this.speakers = this.event.eventDetails.speakers
    let updates = [...this.event.eventDetails.updates]
    this.update = updates.shift()
    this.updates = this.event.eventDetails.updates
    this.agenda = this.event.eventDetails.agenda
    this.dragAndDrop = this.event.eventDetails.dragAndDrop
    this.hall = await this.hallServ.getHall(this.event.hallId)
    this.dragAndDrop = this.event.eventDetails.dragAndDrop
    // for (let item of this.dragAndDrop) {
    //   if (item ==)
    // }
    console.log(this.event)
    console.log(this.hall.name)


  }
  // doReorder(ev: CustomEvent<ItemReorderEventDetail>, groupId: number) {
  //   let groupToChangeIndex = this.event.eventDetails.dragAndDrop.findIndex(
  //     group => group.id === groupId
  //   );
  //   this.groupArray[groupToChangeIndex].items = ev.detail.complete(
  //     this.groupArray[groupToChangeIndex].items
  //   );
  // }
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  // defaultOrder(ev: CustomEvent<ItemReorderEventDetail>) {

  //   for(let key in this.event.eventDetails.dragAndDrop){
  //     ev.
  //   }
  // }

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
        await this.eventServ.editEvent(this.event, this.selectedFile, this.id, this.deleteCurrentPoster)
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

  registerForEvent() {
    // Implement the logic for registering the user for the event
    console.log('Registering for the event:', this.event);
  }

}
