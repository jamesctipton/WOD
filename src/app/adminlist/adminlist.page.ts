import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { IonDatetime } from '@ionic/angular';
import { Data } from '../data';
import { Globals } from '../globals';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-adminlist',
  templateUrl: './adminlist.page.html',
  styleUrls: ['./adminlist.page.scss'],
  providers: [ Globals ]
})
export class AdminlistPage implements OnInit {

  @ViewChildren(IonDatetime) datetimes: QueryList<IonDatetime>;

  constructor(
    private router: Router,
    public global: Globals,
    private http: HttpClient,
  ) {  }

  data: Data[];

  epoch: string = '1970-01-01T00:00:00Z';

  initial: string = '---';
  final: string;

  page: 1;
  totalPages: number;

  options = {
    withCredentials: true,
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  };

  ngOnInit() {
    let now = new Date();
    this.final = now.toDateString();
    (<HTMLInputElement>document.getElementById("initial")).max = now.toISOString();
    (<HTMLInputElement>document.getElementById("final")).max = now.toISOString();

    // css stuff to let user know if storage is empty
    this.toggleListCSS(true);

    this.sendRequest(this.epoch, this.final);
  }

  toggleListCSS(toggle: boolean) {
    (<HTMLInputElement>document.getElementById("list-element")).hidden = toggle;
    (<HTMLInputElement>document.getElementById("zero-items")).hidden = !toggle;
    (toggle) ? (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "-1000" : (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";
    (toggle) ? (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "1000" : (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
    (toggle) ? (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "No items to display." : (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "";
  }

  sendRequest(min, max) {

    let params = 'mindate='+ min +'&maxdate='+ max;

    var self = this;
    this.http
    .post(this.global.url + '/adminphotolist', params, this.options)
    .subscribe(response => {
      console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        if(this.data.length != 0) {
          this.toggleListCSS(false);
        }
      }
      else {
        alert(response['msg']);
      }
    });
  }

  confirm(i) {
    var self = this;
    this.datetimes.get(i).confirm().then( function() {
      if(i == 0) {
        var temp = new Date((<HTMLInputElement>document.getElementById("initial")).value);
        self.initial = temp.toDateString();
      }
      else {
        var temp = new Date((<HTMLInputElement>document.getElementById("final")).value);
        self.final = temp.toDateString();
      }
    });
  }

  submit(all: boolean) {
    (all) ? this.sendRequest('-','-') : this.sendRequest(this.initial, this.final);
  }

  reset(i) {
    var self = this;
    this.datetimes.get(parseInt(i)).reset().then( function() {
      if(i == 0) {
        self.initial = '---';
      }
      else {
        self.final = new Date().toDateString();
      }

      if(self.initial == '---' && self.final == new Date().toDateString()) {
        self.sendRequest(self.epoch, self.final);
      }
    });
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

  back() {
    this.router.navigate(['menu']);
  }

  detail(item) {
    var datum = JSON.stringify(this.data.find( ({id}) => id === item));
    this.router.navigate(['/sample', {id: item, source: 'adminlist', datum: datum}]);
  }

}