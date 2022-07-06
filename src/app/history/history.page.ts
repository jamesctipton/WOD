import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { IonInfiniteScroll, IonLabel } from '@ionic/angular';
import { Data } from '../data';
import { Globals } from '../globals';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  providers: [ Globals ]
})
export class HistoryPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private router: Router,
    private http: HttpClient,
    public global: Globals
    ) {  }

  data: Data[] = [];

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
      }
    });
  }

  back() {
    this.router.navigate(['menu']);
  }

  // loadData(event) {
  //   setTimeout(() => {



  //     // App logic to determine if all data is loaded
  //     // and disable the infinite scroll  => current limit is 1000 but can be extended.
  //     if (this.data.length === 1000) {
  //       event.target.disabled = true;
  //     }
  //   }, 500);
  // }

  detail(item) {
    var datum = JSON.stringify(this.data.find( ({id}) => id === item));
    this.router.navigate(['/sample', {id: item, source: 'history', datum: datum}]);
  }
}