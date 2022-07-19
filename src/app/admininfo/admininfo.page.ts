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

  page: 1;
  totalPages: number;

  options = {
    withCredentials: true,
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  }

  ngOnInit() {

    // if list element has 0 items, display a div letting the user know, else hide the div
    this.toggleListCSS(true);

    var self = this;
    this.http
    .post(this.global.url + '/history', 'page=' + this.page, this.options)
    .subscribe(response => {
      // console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        // console.log(this.data);

        this.totalPages = response['meta']['total_page'];
        this.page++;
        
        // un-empty the storage css
        this.toggleListCSS(false);
      }
      else {
        alert(response['msg']);
      }
    });

  }

  toggleListCSS(toggle: boolean) {
    (<HTMLInputElement>document.getElementById("list-element")).hidden = toggle;
    (<HTMLInputElement>document.getElementById("zero-items")).hidden = !toggle;
    (toggle) ? (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "-1000" : (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";
    (toggle) ? (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "1000" : (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
    (toggle) ? (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "No items to display." : (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "";
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
    let body;
    this.updated.forEach( index => {
      var item = this.data.find( ({id}) => id === index);

      var notes = (<HTMLInputElement>(document.getElementById("notes" + item.id))).value;
      var tags = (<HTMLInputElement>(document.getElementById("tags" + item.id))).value;

      body = 'photo_id=' + item.id + '&notes=' + notes + '&tags=' + tags;

      this.http
      .post(this.global.url + '/adminupdatephotoinfo', body, this.options)
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

  loadData(event) {

    setTimeout(() => {
      var self = this;
      this.http
      .post(this.global.url + '/history', 'page=' + this.page, this.options)
      .subscribe(response => {
        // console.log(response);
        if(response['status'] == 0) {
          var temp: Data[] = Object.values(response['msg']);
          temp.forEach(function (item) {
            item.path = self.global.url + '/' + item.path;
          });
          this.data.concat(temp);
          // console.log(this.data);
          this.page++;
        }
        else {
          alert(response['msg']);
        }
      });

      // App logic to determine if all data is loaded
      // and disable the infinite scroll.
      if (this.page == this.totalPages) {
        event.target.disabled = true;
      }
    }, 500);
    
  }

  changeGPS(id) {
    console.log(id);
  }

}
