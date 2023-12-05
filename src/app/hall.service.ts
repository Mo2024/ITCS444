import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Hall } from './create-hall/create-hall.page';

@Injectable({
  providedIn: 'root'
})
export class HallService {

  constructor(public firestore: Firestore,) { }

  async createHall(hall: Hall) {
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
  async getUserInfo(uid: string) {
    return new Promise(async (resolve, reject) => {
      const q = query(collection(this.firestore, "Users"), where("uid", "==", uid));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc: any) => {
        resolve(doc.data())
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

  async getReservedDateHall(date: any) {
    return new Promise(async (resolve, reject) => {

      let filteredHalls: Hall[] = []
      const querySnapshot = await getDocs(collection(this.firestore, "Halls"));

      querySnapshot.forEach((doc: any) => {
        // doc.data() is never undefined for query doc snapshots
        let reservedDates = doc.data()['reservedDates']
        reservedDates.forEach((element: any) => {
          var date1 = new Date(date.date);
          var date2 = new Date(element.seconds * 1000);
          const isSameDate = date1.toDateString() === date2.toDateString();

          if (isSameDate) {
            filteredHalls.push(doc.data())
          }

        });
      });
      resolve(filteredHalls)

    })

  }

  async requestHallReservation(hallId: string, reservationDate: Date, uid: string) {
    return new Promise(async (resolve, reject) => {
      const year = reservationDate.getFullYear();
      const month = reservationDate.getMonth();
      const day = reservationDate.getDate();

      const newReservationDate = new Date(year, month, day);
      console.log(newReservationDate)
      addDoc(collection(this.firestore, 'RequestedReservation'), { hallId, reservationDate: newReservationDate, status: "pending", uid: uid })
        .then((docRef) => {
          resolve(docRef);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }
  async getCapacityHall(cap: number) {
    return new Promise(async (resolve, reject) => {

      let filteredHalls: Hall[] = []
      const q = query(collection(this.firestore, "Halls"), where("capacity", ">=", cap));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc: any) => {
        filteredHalls.push(doc.data())
      });
      resolve(filteredHalls)

    })

  }

  async getAvailableDateHall(date: any) {
    return new Promise(async (resolve, reject) => {

      let filteredHalls: Hall[] = []
      const querySnapshot = await getDocs(collection(this.firestore, "Halls"));

      querySnapshot.forEach((doc: any) => {
        let isAvailable = true

        doc.data()['reservedDates'].forEach((element: any) => {
          var date1 = new Date(date.date);
          var date2 = new Date(element.seconds * 1000);
          const isSameDate = date1.toDateString() === date2.toDateString();

          if (isSameDate) isAvailable = false; return;

        });
        if (isAvailable) {
          filteredHalls.push(doc.data())
        }
      });
      resolve(filteredHalls)

    })

  }


  async checkIfAlreadyReserved(hallId: string, date: Date, uid: string) {
    return new Promise(async (resolve, reject) => {
      const q = query(collection(this.firestore, "RequestedReservation"),
        where("hallId", "==", hallId),
        where("status", "==", 'pending'),
        where("uid", "==", uid),
        where("reservationDate", "==", date));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc: any) => {
        if (doc.data()['hallId'] == hallId && doc.data()['uid'] == uid) {
          resolve(true);
          return;
        }
      });

      resolve(false)

    })
  }

  async getRequestedHalls() {
    return new Promise(async (resolve, reject) => {
      const q = query(collection(this.firestore, "RequestedReservation"),
        where("status", "==", 'pending'),
      );

      let halls: any[] = []
      const querySnapshot = await getDocs(q);


      querySnapshot.forEach((doc: any) => {
        halls.push(doc.data())
      });
      resolve(halls)

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

  async approveReservation(hallId: string, reservationDate: Date, uid: string) {
    return new Promise(async (resolve, reject) => {
      let reservationsOnThatDay: any[] = []
      let approvedReservation = {}
      const q = query(collection(this.firestore, "RequestedReservation"),
        where("hallId", "==", hallId),
        where("status", "==", 'pending'),
        where("uid", "==", uid),
        where("reservationDate", "==", reservationDate)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc: any) => {
        console.log(doc.data())
        if (doc.data()['hallId'] == hallId && doc.data()['uid'] == uid) {
          // object = { ...doc.data() }
          // console.log(querySnapshot)
          return;
        }
      });
      console.log(reservationsOnThatDay)
      resolve(true)
    })
  }
}
