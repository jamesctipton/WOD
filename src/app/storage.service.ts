import { Injectable, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  length: number = -1;

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.length = this.getlength();
  }

  public setItem(key: string, value: any) {
    this.storage.set(key, value);
  }

  public getItem(key: string) {
    // this.storage.get(key).then(val => {
    //   console.log(val);
    //   return val;
    // });
    // return null;

    return this.storage.get(key);

      // return this.storage.get(key) || [];
  }

  a: any[] = [];

  // get a chunk of items of size <= n, starting at first
  public getNItems(first: string, n: number) {
    this.a = [];
    for(let i=0; i<n; i++) {
      this.a.push(this.storage.get((parseInt(first) + i).toString()));
    }
    return this.a;
  }

  private getlength() {
    this.storage.length().then((val) => {
      return this.length = val;
    });
    return 0;
  }

  public clear() {
    this.storage.clear();
  }

  public removeItem(key: string) {
    this.storage.remove(key);
  }
}
