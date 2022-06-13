import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { IonInfiniteScroll, IonLabel } from '@ionic/angular';
import { Data } from '../data';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  providers: []
})
export class HistoryPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService
  ) {
    this.initStorage();
    // this.route.params.subscribe( params => console.log(params) );
  }

  async initStorage() {
    await this.storage.init();
  }

  data: Data[] = [];
  // how much data to load in initially
  initData = 20;

  ngOnInit() {

    var local_length = this.storage.length;

    if(local_length == 0 || local_length == NaN) {
      // css stuff to let user know if storage is empty
      (<HTMLInputElement>document.getElementById("list-element")).hidden = true;
      (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "-1000";

      (<HTMLInputElement>document.getElementById("zero-items")).hidden = false;
      (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "1000";
      (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "No items to display.";
    }
    else {
      (<HTMLInputElement>document.getElementById("list-element")).hidden = false;
      (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";

      (<HTMLInputElement>document.getElementById("zero-items")).hidden = true;
      (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
    
      var a = this.storage.getNItems('1', this.initData);
      var b = [];

      // resolve all promises, concat onto data array
      Promise.all(a).then((vals) => {
        vals.forEach(function (val) {
          // filter out null values, copy into array b
          if(val != null) {
            b.push(val);
          }
        });
        this.data = this.data.concat(b);
      });
    }
  }

  back() {
    this.router.navigate(['menu']);
  }

  j: number = this.initData + 1;

  loadData(event) {
    // how large of chunks to grab from storage at a time
    var inc = 10;
    setTimeout(() => {
      // get an array of inc promises from storage
      // temp array a to hold values
      var a = this.storage.getNItems(this.j.toString(), inc);

      // temp array b to use for filtering
      var b = [];
      // resolve all promises, concat onto data array
      Promise.all(a).then((vals) => {
        vals.forEach(function (val) {
          // filter out null values, copy into array b
          if(val != null) {
            b.push(val);
          }
        });
        this.data = this.data.concat(b);
        event.target.complete();
        this.j+= inc;
      });

      // App logic to determine if all data is loaded
      // and disable the infinite scroll  => current limit is 1000 but can be extended.
      if (this.data.length === 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  detail(id) {
    this.router.navigate(['/sample', {id: id, source: 'history'}]);
  }
}