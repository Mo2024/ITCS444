import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { distinctUntilKeyChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(public firestore: Firestore, public storage: Storage,) { }

  uploadPoster(file: any) {
    return new Promise(async (resolve, reject) => {
      const storageRef = ref(this.storage, file.name)
      const uploadPoster = uploadBytesResumable(storageRef, file)

      uploadPoster.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('upload is ' + progress + '% done')
        },
        (error) => {
          // Handle errors during upload
          console.error('Upload error:', error)
          reject(error)
        },
        () => {
          // Upload completed successfully
          getDownloadURL(uploadPoster.snapshot.ref)
            .then((downloadUrl) => {
              console.log('File available at: ', downloadUrl)
              resolve(downloadUrl) // Resolve the promise with the download URL
            })
            .catch((error) => {
              console.error('Error getting download URL:', error)
              reject(error)
            })
        }
      )
    })
  }

  createEvent(eventDetails: object, selectedFile: any, eid: string) {
    return new Promise(async (resolve, reject) => {
      if (selectedFile) {
        let posterUrl = await this.uploadPoster(selectedFile)
        eventDetails = { ...eventDetails, posterUrl }
      }
      const q = query(collection(this.firestore, "Reservations"), where("eid", "==", eid));

      const querySnapshot = await getDocs(q) as any;
      let event = querySnapshot.docs[0]

      updateDoc(doc(this.firestore, 'Reservations', event.id as string), {
        ...event.data(),
        eventStatus: true,
        eventDetails
      })
        .then((docRef) => {
          resolve(docRef);
        })
        .catch((error) => {
          reject(error);
        });

    })
  }

}
