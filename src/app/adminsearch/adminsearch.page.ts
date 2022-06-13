import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from '../data';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-adminsearch',
  templateUrl: './adminsearch.page.html',
  styleUrls: ['./adminsearch.page.scss'],
})
export class AdminsearchPage implements OnInit {

  constructor(
    private router: Router,
    private storage: StorageService
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.init();
  }

  data: Data[] = [];      // data to load
  search_indexes: Data[] = []; // searched data to load
  initData = 20;

  ngOnInit() {

    var local_length = this.storage.length;

    // if list element has 0 items, display a div letting the user know, else hide the div
    if(local_length == 0) {
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
        this.search_indexes = this.data;
      });
    }
  }

  back() {
    this.router.navigate(['menu']);
  }

  search() {
    let geo = (<HTMLInputElement>document.getElementById("geo")).value;
    let notes = (<HTMLInputElement>document.getElementById("notes")).value;
    let tags = (<HTMLInputElement>document.getElementById("tags")).value;

    this.search_indexes.forEach(item => {

      if( !
        (item.gps.includes(geo) &&
         item.notes.includes(notes) &&
         item.tags.includes(tags))
        ) {

           // if array does not have any of the geo, notes, or tags searches, remove it
           this.search_indexes.splice(this.search_indexes.indexOf(item), 1);
           // need to recursively call search for some reason the updating is weird.
           this.search();
        }
    });

    if(this.search_indexes.length == 0) {
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
    }

  }

  reset() {
    // reset search indexes to full data backup
    this.search_indexes = this.data;
    // clear text fields
    window.location.reload();
    (<HTMLInputElement>document.getElementById("geo")).value = '';
    (<HTMLInputElement>document.getElementById("notes")).value = '';
    (<HTMLInputElement>document.getElementById("tags")).value = '';

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
        this.search_indexes = this.data;
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
    this.router.navigate(['/sample', {id: id, source: 'adminsearch'}]);
  }

}
