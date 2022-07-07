import { Component, Injectable, OnInit, SkipSelf } from '@angular/core';
import { Router } from '@angular/router';
import { map, filter, switchMap, catchError } from 'rxjs/operators';

import { ViewChild, ElementRef  } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';  
import { UploadserviceService } from  '../uploadservice.service';

import { Data } from '../data';
import { DatePipe } from '@angular/common';
import { StorageService } from '../storage.service';
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

  lat: number = NaN;
  lng: number = NaN;

  coords: string;

  file: any;
  formData: any;
  progress: Number;
  inProgress: boolean = false;
  filesUploaded: boolean = false;

  ngOnInit(): void {

    (<HTMLInputElement>document.getElementById("spinner-box")).hidden = false;
    (<HTMLInputElement>document.getElementById("spinner-box")).style.zIndex = "1000";
    (<HTMLInputElement>document.getElementById("progress")).innerHTML = "Getting Location...";

    // initialize the mapkit API before anything
    const tokenID = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlhBVjVZQzVTUFYifQ.eyJpc3MiOiJaQTVSOVg4NUI1IiwiaWF0IjoxNjUzMzY1NTE5LCJleHAiOjE2NzI0NDQ4MDB9.al1bW4MPG9yom_cEZh13dDyAWnrmuU2QsUo-8_ziE9I-iqydqKBcm5GEbYNgfPSPjaXGsrR4nmlBosbPpgfvxQ";  
    mapkit.init({     
      authorizationCallback: function(done) {         
        done(tokenID);     
    } }); 

    var self = this;
    navigator.geolocation.getCurrentPosition(function(pos) {
      self.lat = pos.coords.latitude;
      self.lng = pos.coords.longitude;
      self.coords = self.lat + ',' + self.lng;

      (<HTMLInputElement>document.getElementById("spinner-box")).hidden = true;
      (<HTMLInputElement>document.getElementById("spinner-box")).style.zIndex = "-1000";
      (<HTMLInputElement>document.getElementById("progress")).innerHTML = "";
    });
  }

  data: Data = {
    id : '',
    gps : '',
    path : '',
    notes : '',
    result : 0,
    tags : '',
    date : ''
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

      (<HTMLInputElement>document.getElementById("spinner-box")).hidden = false;
      (<HTMLInputElement>document.getElementById("spinner-box")).style.zIndex = "1000";
      (<HTMLInputElement>document.getElementById("progress")).innerHTML = "File Uploading...";

      for(var j=0; j < fileUpload.files.length; j++) {
        this.file = fileUpload.files.item(j);
        const reader = new FileReader();

        var self = this; //outside angular 'this' => can use self within anonymous functions

        var geoData = (<HTMLInputElement>document.getElementById("gps")).value;
        var notesData = (<HTMLInputElement>document.getElementById("notes")).value;

        reader.onload = function (e) {
          const csv: string = e.target.result as string;
                    
          // retrieve geo, notes, and img path data from form
          self.data.gps = geoData;
          self.data.notes = notesData;
          self.data.path = csv;

          // create date for upload
          var pipe = new DatePipe('en-US');
          const now = Date.now();
          self.data.date = pipe.transform(now, 'short');

          const formData = new FormData(fileForm);
          formData.append('gps', self.data.gps);
          formData.append('photo', self.file);
          formData.append('notes', self.data.notes); 
          self.file.inProgress = true;
          self.inProgress = self.file.inProgress;

          self.formData = formData;

          (<HTMLInputElement>document.getElementById("success")).innerHTML += "<ul>" + self.file.name + "</ul>";
          if(self.file.inProgress == 1) {
            self.filesUploaded = true;
          }
        }

        if(this.file) {
          reader.readAsDataURL(this.file);
        }
      }

      (<HTMLInputElement>document.getElementById("spinner-box")).hidden = true;
      (<HTMLInputElement>document.getElementById("spinner-box")).style.zIndex = "-1000";
      (<HTMLInputElement>document.getElementById("progress")).innerHTML = "";
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
            self.progress = self.file.progress;
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
            alert(event.body['msg']);
            this.filesUploaded = false;
            this.inProgress = false;
            window.location.reload();
          } 
        }  
      });  
  }

}
