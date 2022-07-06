import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from '../data';
import { Globals } from '../globals';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-adminsearch',
  templateUrl: './adminsearch.page.html',
  styleUrls: ['./adminsearch.page.scss'],
  providers: [ Globals ]
})
export class AdminsearchPage implements OnInit {

  constructor(
    private router: Router,
    public global: Globals,
    private http: HttpClient
    ) { }

  data: Data[] = [];      // data to load
  search_indexes: Data[] = []; // searched data to load

  ngOnInit() {

    // css stuff to let user know if storage is empty
    (<HTMLInputElement>document.getElementById("list-element")).hidden = true;
    (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "-1000";

    (<HTMLInputElement>document.getElementById("zero-items")).hidden = false;
    (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "1000";
    (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "No items to display.";
    
    let options = {
      withCredentials: true
    }

    var self = this;
    this.http
    .get(this.global.url + '/history', options)
    .subscribe(response => {
      if(response['status'] == 0) {
        // console.log(response);
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        
        // un-empty the storage css
        (<HTMLInputElement>document.getElementById("list-element")).hidden = false;
        (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";

        (<HTMLInputElement>document.getElementById("zero-items")).hidden = true;
        (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
      }
      else {
        alert(response['msg']);
      }
    });
  }

  back() {
    this.router.navigate(['menu']);
  }

  search() {
    // intersection or union of search criteria? Button for this?
    let geo = (<HTMLInputElement>document.getElementById("geo")).value;
    let radius = (<HTMLInputElement>document.getElementById("radius")).value;
    let unit = (<HTMLInputElement>document.getElementById("unit")).value;
    let notes = (<HTMLInputElement>document.getElementById("notes")).value;
    let tags = (<HTMLInputElement>document.getElementById("tags")).value;

    let geoParams = 'gps=' + geo + '&radius=' + radius + '&radiusunit=' + unit;
    let notesParams = 'querystring=' + notes;
    let tagsParams = 'taglist=' + tags;

    let options = {
      withCredentials: true,
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }

    var self = this;

    // GPS SEARCH FILTER
    this.http
    .post(this.global.url + '/searchfiltergeography', geoParams, options)
    .subscribe(response => {
      // console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        
        // un-empty the storage css
        (<HTMLInputElement>document.getElementById("list-element")).hidden = false;
        (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";

        (<HTMLInputElement>document.getElementById("zero-items")).hidden = true;
        (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
      }
      else {
        alert(response['msg']);
      }
    });
    // NOTES SEARCH FILTER
    this.http
    .post(this.global.url + '/searchfilterglobal', notesParams, options)
    .subscribe(response => {
      // console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        
        // un-empty the storage css
        (<HTMLInputElement>document.getElementById("list-element")).hidden = false;
        (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";

        (<HTMLInputElement>document.getElementById("zero-items")).hidden = true;
        (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
      }
      else {
        alert(response['msg']);
      }
    });

    // TAGS SEARCH FILTER
    this.http
    .post(this.global.url + '/searchfiltertag', tagsParams, options)
    .subscribe(response => {
      // console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        
        // un-empty the storage css
        (<HTMLInputElement>document.getElementById("list-element")).hidden = false;
        (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";

        (<HTMLInputElement>document.getElementById("zero-items")).hidden = true;
        (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
      }
      else {
        alert(response['msg']);
      }
    });

    if(this.data.length == 0) {
      (<HTMLInputElement>document.getElementById("list-element")).hidden = true;
      (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "-1000";

      (<HTMLInputElement>document.getElementById("zero-items")).hidden = false;
      (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "1000";
      (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "No items to display.";
    }
  }

  reset() {

    this.ngOnInit();

    (<HTMLInputElement>document.getElementById("geo")).value = '';
    (<HTMLInputElement>document.getElementById("radius")).value = '';
    (<HTMLInputElement>document.getElementById("unit")).value = '';
    (<HTMLInputElement>document.getElementById("notes")).value = '';
    (<HTMLInputElement>document.getElementById("tags")).value = '';
  }

  // search() {
  //   let geo = (<HTMLInputElement>document.getElementById("geo")).value;
  //   let notes = (<HTMLInputElement>document.getElementById("notes")).value;
  //   let tags = (<HTMLInputElement>document.getElementById("tags")).value;

  //   this.search_indexes.forEach(item => {

  //     if( !
  //       (item.gps.includes(geo) &&
  //        item.notes.includes(notes) &&
  //        item.tags.includes(tags))
  //       ) {

  //          // if array does not have any of the geo, notes, or tags searches, remove it
  //          this.search_indexes.splice(this.search_indexes.indexOf(item), 1);
  //          // need to recursively call search for some reason the updating is weird.
  //          this.search();
  //       }
  //   });

  //   if(this.search_indexes.length == 0) {
  //     (<HTMLInputElement>document.getElementById("list-element")).hidden = true;
  //     (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "-1000";

  //     (<HTMLInputElement>document.getElementById("zero-items")).hidden = false;
  //     (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "1000";
  //     (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "No items to display.";
  //   }
  //   else {
  //     (<HTMLInputElement>document.getElementById("list-element")).hidden = false;
  //     (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";

  //     (<HTMLInputElement>document.getElementById("zero-items")).hidden = true;
  //     (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
  //   }

  // }

  // reset() {
  //   // reset search indexes to full data backup
  //   this.search_indexes = this.data;
  //   // clear text fields
  //   window.location.reload();
  //   (<HTMLInputElement>document.getElementById("geo")).value = '';
  //   (<HTMLInputElement>document.getElementById("notes")).value = '';
  //   (<HTMLInputElement>document.getElementById("tags")).value = '';

  // }

  // loadData(event) {
  //   // how large of chunks to grab from storage at a time
  //   var inc = 10;
  //   setTimeout(() => {
  //     // get an array of inc promises from storage
  //     // temp array a to hold values
  //     var a = this.storage.getNItems(this.j.toString(), inc);

  //     // temp array b to use for filtering
  //     var b = [];
  //     // resolve all promises, concat onto data array
  //     Promise.all(a).then((vals) => {
  //       vals.forEach(function (val) {
  //         // filter out null values, copy into array b
  //         if(val != null) {
  //           b.push(val);
  //         }
  //       });
  //       this.data = this.data.concat(b);
  //       this.search_indexes = this.data;
  //       event.target.complete();
  //       this.j+= inc;
  //     });

  //     // App logic to determine if all data is loaded
  //     // and disable the infinite scroll  => current limit is 1000 but can be extended.
  //     if (this.data.length === 1000) {
  //       event.target.disabled = true;
  //     }
  //   }, 500);
  // }

  detail(item) {
    var datum = JSON.stringify(this.data.find( ({id}) => id === item));
    this.router.navigate(['/sample', {id: item, source: 'adminsearch', datum: datum}]);
  }

}
