import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { Data } from '../data';
import { Globals } from '../globals';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-admininfo',
  templateUrl: './admininfo.page.html',
  styleUrls: ['./admininfo.page.scss'],
  providers: [ Globals ]
})
export class AdmininfoPage implements OnInit {

  constructor(
    private router: Router,
    public global: Globals,
    private http: HttpClient
  ) {  }

  data: Data[] = [];      // data to load
  updated: string[] = []; // keep track of each data item that gets updated when the input is changed

  ngOnInit() {

    // if list element has 0 items, display a div letting the user know, else hide the div
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
      // console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        // console.log(this.data);
        
        // un-empty the storage css
        (<HTMLInputElement>document.getElementById("list-element")).hidden = false;
        (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";

        (<HTMLInputElement>document.getElementById("zero-items")).hidden = true;
        (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
      }
      else {
        alert(response['msg']);
        (<HTMLInputElement>document.getElementById("list-element")).hidden = false;
        (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";

        (<HTMLInputElement>document.getElementById("zero-items")).hidden = true;
        (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
      }
    });

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
    let options = {
      withCredentials: true,
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }

    let body;

    this.updated.forEach( index => {
      var item = this.data.find( ({id}) => id === index);

      var notes = (<HTMLInputElement>(document.getElementById("notes" + item.id))).value;
      var tags = (<HTMLInputElement>(document.getElementById("tags" + item.id))).value;

      body = 'photo_id=' + item.id + '&notes=' + notes + '&tags=' + tags;

      this.http
      .post(this.global.url + '/adminupdatephotoinfo', body, options)
      .subscribe(response => {
        console.log(response);
        if(response['status'] == 0) {
          alert('Update Success!');
        }
        else {
          alert(response['msg']);
        }
      });
    });
  }

  // figure out which element got appended and add it to an array for later use
  updated_append(e, source, id) {
    // source required to figure out which element the update request comes from
    if(source == 'notes') {
      (<HTMLInputElement>(document.getElementById("notes" + id))).value = e.target.value;
    }
    if(source == 'tags') {
      (<HTMLInputElement>(document.getElementById("tags" + id))).value = e.target.value;
    }

    // push to updated array
    this.updated.push(id);
  }

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

  changeGPS(id) {
    console.log(id);
  }

}
