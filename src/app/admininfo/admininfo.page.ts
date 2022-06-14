import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from '../data';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-admininfo',
  templateUrl: './admininfo.page.html',
  styleUrls: ['./admininfo.page.scss'],
})
export class AdmininfoPage implements OnInit {

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
  updated: string[] = []; // keep track of each data item that gets updated when the input is changed
  initData = 20;

  ngOnInit() {

    try {
      var local_length = this.storage.length;
    }
    catch {
      this.storage.length = 0;
    }

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
      });
    }
  }

  back() {
    if(this.updated.length > 0) {
      if(window.confirm("You have unsaved updates!\nAny unsaved updates may not persist.")) {
        this.router.navigate(['menu']);
      }
    }
    else {
      this.router.navigate(['menu']);
    }
  }

  update() {
    var success = true; // check for successful update to let user know
    // iterate through all items that have been updated since last update
    this.updated.forEach(id => {
      // pull item with id, update notes and tags field, then overwrite the item in local
      var item: Data;
      
      this.storage.getItem(id).then((val) => {
        item = val;

        item.notes = (<HTMLInputElement>(document.getElementsByClassName("notes"))[parseInt(id)-1]).value;
        item.tags = (<HTMLInputElement>(document.getElementsByClassName("tags"))[parseInt(id)-1]).value;

        try {
          // this.storage.removeItem(item.id);
          this.storage.setItem(item.id, item);
        } catch (e) {
          success = false;
          if(e == "QuotaExceededError") {
            alert('Failed to update.');
          }
          else {
            alert(e);
          }
        }
      });
    });

    if(success) {
      // remove everything from updated once its done
      this.updated = [];
      alert("Updated Successfully.");
    }
  }

  // figure out which element got appended and add it to an array for later use
  updated_append(e, source, id) {
    // source required to figure out which element the update request comes from
    if(source == 'notes') {
    (<HTMLInputElement>(document.getElementsByClassName("notes"))[id-1]).value = e.target.value;
    }
    if(source == 'tags') {
      (<HTMLInputElement>(document.getElementsByClassName("tags"))[id-1]).value = e.target.value;
    }

    // update of AdminInfoPage data attribute as well as updating the live HTML
    this.data[parseInt(id)-1].notes = (<HTMLInputElement>(document.getElementsByClassName("notes"))[parseInt(id)-1]).value;
    this.data[parseInt(id)-1].tags = (<HTMLInputElement>(document.getElementsByClassName("tags"))[parseInt(id)-1]).value;

    // push to updated array
    this.updated.push(id);
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

  changeGPS(id) {
    console.log(id);
  }

}
