import { Component, Injectable, OnInit, SkipSelf } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { identity, Observable } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';

import { ViewChild, ElementRef  } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';  
import { UploadserviceService } from  '../uploadservice.service';

import { Data } from '../data';
import { DatePipe } from '@angular/common';
import { StorageService } from '../storage.service';
import { AuthGuard } from '../auth.guard';

declare const mapkit: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  providers: [AuthGuard]
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
    private storage: StorageService
  ) { 
    this.initStorage();
  }

  lat: number = NaN;
  lng: number = NaN;

  coords: string;

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

  async initStorage() {
    await this.storage.init();
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

//   uploadFile(file) {
//     const formData = new FormData();  
//     formData.append('file', file.data);  
//     file.inProgress = true;

//     this.uploadService.upload(formData).pipe(  
//       map(event => {  
//         switch (event.type) {  
//           case HttpEventType.UploadProgress:  
//             file.progress = Math.round(event.loaded * 100 / event.total);  
//             break;  
//           case HttpEventType.Response:  
//             return event;  
//         }  
//       }),  
//       catchError((error: HttpErrorResponse) => {  
//         file.inProgress = false;  
//         return of(`${file.data.name} upload failed.`);  
//       })).subscribe((event: any) => {  
//         if (typeof (event) === 'object') {  
//           console.log(event.body);  
//         }  
//       });  
//   }

//   private uploadFiles() {  
//     this.fileUpload.nativeElement.value = '';  
//     this.files.forEach(file => {  
//       this.uploadFile(file); 
//     });  
//   }

  onChange() {

    if((<HTMLInputElement>document.getElementById("gps")).value == '') {
        window.alert("GPS field must be filled.\nAllow current location to autofill.");
        return;
    }

    const fileUpload = this.fileUpload.nativeElement;

    fileUpload.onchange = (evt) => {

      (<HTMLInputElement>document.getElementById("spinner-box")).hidden = false;
      (<HTMLInputElement>document.getElementById("spinner-box")).style.zIndex = "1000";
      (<HTMLInputElement>document.getElementById("progress")).innerHTML = "File Uploading...";

      for(var j=0; j < fileUpload.files.length; j++) {
        const file = fileUpload.files[j];
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

          // length update
          if(self.storage.length == NaN) {
            // if storage has not been used yet
            self.storage.length = 0;
          }
          else if(self.storage.length == 0) {
            self.storage.length = 1;
          }
          else {
            self.storage.length += 1;
          }

          // set data id number
          self.data.id = self.storage.length.toString();
          
          // set key = id, value = data in storage
          self.storage.setItem(self.storage.length.toString(), self.data);


          // const formData = new FormData();  
          // formData.append('file', file.data);  
          // file.inProgress = true;

          self.uploadService.upload(self.data).pipe(  
            map(event => {  
              switch (event.type) {  
                case HttpEventType.UploadProgress:  
                  file.progress = Math.round(event.loaded * 100 / event.total);  
                  break;  
                case HttpEventType.Response:  
                  return event;  
              }  
            }),  
            catchError((error: HttpErrorResponse) => {  
              file.inProgress = false;  
              return of(`${file.data.name} upload failed.`);  
            })).subscribe((event: any) => {  
              if (typeof (event) === 'object') {  
                console.log(event.body);  
              }  
            });  



          (<HTMLInputElement>document.getElementById("success")).innerHTML += "<ul>" + file.name + "</ul>";
        }

        if(file) {
          reader.readAsDataURL(file);
        }
      }

      (<HTMLInputElement>document.getElementById("spinner-box")).hidden = true;
      (<HTMLInputElement>document.getElementById("spinner-box")).style.zIndex = "-1000";
      (<HTMLInputElement>document.getElementById("progress")).innerHTML = "";
    }

    // artificial click for the file upload element => starts the onchange function
    fileUpload.click();
  }

  // onClick() {  
  //   const fileUpload = this.fileUpload.nativeElement;
  //   fileUpload.onchange = () => {  
  //     for (let index = 0; index < fileUpload.files.length; index++)  
  //     {  
  //     const file = fileUpload.files[index];  
  //     this.files.push({ data: file, inProgress: false, progress: 0});  
  //     }  
  //       this.uploadFiles();  
  //   };  
  //   fileUpload.click();  
  // }

}
