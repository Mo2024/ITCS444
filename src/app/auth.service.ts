import { Injectable } from '@angular/core';
import {
  Auth,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendSignInLinkToEmail
} from '@angular/fire/auth';
import { Firestore, collection } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import * as admin from 'firebase-admin';
import {
  getDocs, doc, deleteDoc, updateDoc, docData, setDoc,
  addDoc, query
} from '@angular/fire/firestore';
import { where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public firestore: Firestore, public auth: Auth, private alertController: AlertController) { }

  signIn(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      signOut(this.auth)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


  signUp(email: string, password: string, userType: string): Promise<any> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await addDoc(collection(this.firestore, 'Users'), { email: email, userType });
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getUserType(email: string) {
    
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
