import { Injectable } from '@angular/core';

import { Client } from './shared/client.model';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public clientsCollection: AngularFirestoreCollection<Client> = this.afs.collection('clients');

  constructor(public afs: AngularFirestore) { }

  getClients(): Observable<Client[]> {
    return this.clientsCollection.valueChanges();
  }

  public addClient(c: Client): any {
    c.id = this.afs.createId();
    return this.clientsCollection.doc(c.id).set(c);
  }

  public deleteClient(c: Client): any {
    return this.clientsCollection.doc(c.id).delete();
  }

  public updateClient(c: Client): any {
    return this.clientsCollection.doc(c.id).set(c);
  }

  public searchByName(name: string): Observable<Client[]> {
    return this.afs.collection<Client>('clients',
            ref => ref.orderBy('name').startAt(name).endAt(name + '\uf8ff'))
            .valueChanges();
  }

}
