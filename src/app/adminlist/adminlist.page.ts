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

  ngOnInit() {
    let now = new Date();
    this.final = now.toDateString();
    (<HTMLInputElement>document.getElementById("initial")).max = now.toISOString();
    (<HTMLInputElement>document.getElementById("final")).max = now.toISOString();

    // css stuff to let user know if storage is empty
    (<HTMLInputElement>document.getElementById("list-element")).hidden = true;
    (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "-1000";

    (<HTMLInputElement>document.getElementById("zero-items")).hidden = false;
    (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "1000";
    (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "No items to display.";

    this.sendRequest(this.epoch, this.final);

  }

  sendRequest(min, max) {
    let options = {
      withCredentials: true,
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = 'mindate='+ min +'&maxdate='+ max;

    var self = this;
    this.http
    .post(this.global.url + '/adminphotolist', params, options)
    .subscribe(response => {
      console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        if(this.data.length != 0) {
          (<HTMLInputElement>document.getElementById("list-element")).hidden = false;
          (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";

          (<HTMLInputElement>document.getElementById("zero-items")).hidden = true;
          (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
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

  submit() {
    this.sendRequest(this.initial, this.final);
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

  back() {
    this.router.navigate(['menu']);
  }

  detail(item) {
    var datum = JSON.stringify(this.data.find( ({id}) => id === item));
    this.router.navigate(['/sample', {id: item, source: 'adminlist', datum: datum}]);
  }

}
