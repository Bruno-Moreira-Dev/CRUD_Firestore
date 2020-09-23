import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Product } from './shared/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public productsCollection: AngularFirestoreCollection<Product> = this.afs.collection('products');

  constructor(public afs: AngularFirestore) { }

  getProducts(): Observable<Product[]> {
    return this.productsCollection.valueChanges();
  }

  addProduct(p: Product) {
    p.id = this.afs.createId();
    return this.productsCollection.doc(p.id).set(p);
    //return this.productsCollection.add(p);
  }

  deleteProduct(p: Product) {
    return this.productsCollection.doc(p.id).delete();
  }

  updateProduct(p: Product) {
    return this.productsCollection.doc(p.id).set(p);
  }

  searchByName(name: string): Observable<Product[]> {
    return this.afs.collection<Product>('products', 
           ref => ref.orderBy('name').startAt(name).endAt(name+"\uf8ff"))
           .valueChanges();
  }

}
