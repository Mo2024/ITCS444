import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Hall } from './create-hall/create-hall.page';

@Injectable({
  providedIn: 'root'
})
export class HallService {

  constructor(public firestore: Firestore,) { }

  async createHall(hall: object) {
    return new Promise((resolve, reject) => {
      addDoc(collection(this.firestore, 'Halls'), hall)
        .then((docRef) => {
          resolve(docRef);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }
  async deleteHall(id: any) {
    return new Promise((resolve, reject) => {
      deleteDoc(doc(this.firestore, 'Halls', id))
        .then((docRef) => {
          resolve(docRef);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }
  async getHall(id: any) {
    return new Promise((resolve, reject) => {
      getDoc(doc(this.firestore, 'Halls', id))
        .then((docRef) => {
          resolve({ id, ...docRef.data() });
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  async updateHall(hall: Hall) {
    return new Promise((resolve, reject) => {
      updateDoc(doc(this.firestore, 'Halls', hall.id as string), {
        name: hall.name,
        capacity: hall.capacity,
        numberOfBoothsFitting: hall.numberOfBoothsFitting,
        BDTeamContact: hall.BDTeamContact,
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
