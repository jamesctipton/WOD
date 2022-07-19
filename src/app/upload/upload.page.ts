import { Component, Injectable, OnInit, SkipSelf } from '@angular/core';
import { Router } from '@angular/router';
import { map, filter, switchMap, catchError } from 'rxjs/operators';

import { ViewChild, ElementRef  } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';  
import { UploadserviceService } from  '../uploadservice.service';

import { Data } from '../data';
import { DatePipe } from '@angular/common';
import { AuthGuard } from '../auth.guard';
import { Globals } from '../globals';

declare const mapkit: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  providers: [AuthGuard, Globals]
})

@Injectable({
  providedIn: 'root'
})
export class UploadPage implements OnInit {

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files = [];

  navigate: any;
  constructor(
    private router: Router,
    private uploadService: UploadserviceService,
    public global: Globals,
  ) { }

  coords: string;

  file: any;
  formData: any;
  progress: Number;
  inProgress: boolean = false;
  filesUploaded: boolean = false;

  data: Data;

  ngOnInit(): void {

    this.spinnerBoxToggle(false);

    // initialize the mapkit API before anything
    const tokenID = this.global.token;
    mapkit.init({     
      authorizationCallback: function(done) {         
        done(tokenID);     
    } }); 

    var self = this;
    navigator.geolocation.getCurrentPosition(function(pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      self.coords = lat + ',' + lng;

      self.spinnerBoxToggle(true);
    });
  }

  spinnerBoxToggle(toggle: boolean) {
    (<HTMLInputElement>document.getElementById("spinner-box")).hidden = toggle;
    (toggle) ? (<HTMLInputElement>document.getElementById("spinner-box")).style.zIndex = "-1000" : (<HTMLInputElement>document.getElementById("spinner-box")).style.zIndex = "1000";
    (toggle) ? (<HTMLInputElement>document.getElementById("progress")).innerHTML = "" : (<HTMLInputElement>document.getElementById("progress")).innerHTML = "Getting Location...";
  }

  back() {
    this.router.navigate(['menu']);
  }

  onChange() {

    if((<HTMLInputElement>document.getElementById("gps")).value == '') {
        window.alert("GPS field must be filled.\nAllow current location to autofill.");
        return;
    }
    
    const fileForm = (<HTMLFormElement>(document.getElementById("fileForm")));
    const fileUpload = this.fileUpload.nativeElement;

    fileUpload.onchange = (evt) => {

      for(var j=0; j < fileUpload.files.length; j++) {
        this.file = fileUpload.files.item(j);
        const reader = new FileReader();

        var self = this; //outside angular 'this' => can use self within anonymous functions

        reader.onload = function (e) {
          const csv: string = e.target.result as string;
                    
          // retrieve geo, notes, and img data from form
          self.data.gps = (<HTMLInputElement>document.getElementById("gps")).value;
          self.data.notes = (<HTMLInputElement>document.getElementById("notes")).value;
          self.data.path = csv;

          // create date for upload
          var datepipe = new DatePipe('en-US');
          const now = Date.now();
          self.data.date = datepipe.transform(now, 'short');

          self.formData = new FormData(fileForm);
          self.formData.append('gps', self.data.gps);
          self.formData.append('photo', self.file);
          self.formData.append('notes', self.data.notes); 
          self.file.inProgress = true;
          // self.inProgress = self.file.inProgress;

          (<HTMLInputElement>document.getElementById("success")).innerHTML += "<ul>" + self.file.name + "</ul>";
          if(self.file.inProgress == true) {
            self.filesUploaded = true;
          }
        }

        if(this.file) {
          reader.readAsDataURL(this.file);
        }
      }
    }
    // artificial click for the file upload element => starts the onchange function
    fileUpload.click();
  }

  submit() {

    var self = this;
    this.uploadService.upload(this.formData).pipe(  
      map(event => {  
        switch (event.type) {  
          case HttpEventType.UploadProgress:  
            self.file.progress = Math.round(event.loaded / event.total);  
            // self.progress = self.file.progress;
            break;  
          case HttpEventType.Response:  
            return event;  
        }  
      }),  
      catchError((error: HttpErrorResponse) => {  
        self.file.inProgress = false;
        self.filesUploaded = false;  
        return of(`${self.file.data.name} upload failed.`);  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
          console.log(event.body); 
          if(event.body['status'] == 0) {
            alert(event.body['msg'] + "\nPredicted Oil Content: " + event.body['meta']['result']);  // check whats returned and format the result values
            this.filesUploaded = false;
            // this.inProgress = false;
            window.location.reload();
          } 
        }  
      });  
  }

}
