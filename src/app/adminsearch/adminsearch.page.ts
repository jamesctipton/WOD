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

  page: 1;
  totalPages: number;

  options = {
    withCredentials: true,
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  };

  ngOnInit() {

    // css stuff to let user know if storage is empty
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

    var self = this;

    // CURRENTLY THE FILTERS ARE BY INTERSECTION

    // GPS SEARCH FILTER
    this.http
    .post(this.global.url + '/searchfiltergeography', geoParams, this.options)
    .subscribe(response => {
      // console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        // un-empty the storage css
        this.toggleListCSS(false);
      }
      else {
        alert(response['msg']);
      }
    });
    // NOTES SEARCH FILTER
    this.http
    .post(this.global.url + '/searchfilterglobal', notesParams, this.options)
    .subscribe(response => {
      // console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        // un-empty the storage css
        this.toggleListCSS(false);
      }
      else {
        alert(response['msg']);
      }
    });

    // TAGS SEARCH FILTER
    this.http
    .post(this.global.url + '/searchfiltertag', tagsParams, this.options)
    .subscribe(response => {
      // console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        // un-empty the storage css
        this.toggleListCSS(false);
      }
      else {
        alert(response['msg']);
      }
    });

    if(this.data.length == 0) {
      this.toggleListCSS(true);
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

  loadData(event) {

    // setTimeout(() => {
    //   var self = this;
    //   this.http
    //   .post(this.global.url + '/history', 'page=' + this.page, this.options)
    //   .subscribe(response => {
    //     // console.log(response);
    //     if(response['status'] == 0) {
    //       var temp: Data[] = Object.values(response['msg']);
    //       temp.forEach(function (item) {
    //         item.path = self.global.url + '/' + item.path;
    //       });
    //       this.data.concat(temp);
    //       // console.log(this.data);
    //       this.page++;
    //     }
    //     else {
    //       alert(response['msg']);
    //     }
    //   });

    //   // App logic to determine if all data is loaded
    //   // and disable the infinite scroll.
    //   if (this.page == this.totalPages) {
    //     event.target.disabled = true;
    //   }
    // }, 500);
    
  }

  detail(item) {
    var datum = JSON.stringify(this.data.find( ({id}) => id === item));
    this.router.navigate(['/sample', {id: item, source: 'adminsearch', datum: datum}]);
  }

}

// need to do pages later but not urgent because low db amounts now