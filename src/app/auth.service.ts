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
import { getDoc, where } from 'firebase/firestore';

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


  signUp(email: string, password: string, userType: string, name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await addDoc(collection(this.firestore, 'Users'), { email: email, userType, uid: user.uid, name });
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getUser(id: string) {
    return new Promise(async (resolve, reject) => {

      const q = query(collection(this.firestore, "Users"),
        where("uid", "==", id),
      );
      const querySnapshot = await getDocs(q);


      let user = querySnapshot.docs[0] as any
      user = { ...user.data() }
      // for (const doc of querySnapshot.docs) {
      resolve(user);
      //   break;
      // }

    })
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
