import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Data } from '@angular/router';
import { StorageService } from '../storage.service';

declare const mapkit: any;

@Component({
  selector: 'app-sample',
  templateUrl: './sample.page.html',
  styleUrls: ['./sample.page.scss'],
})
export class SamplePage implements OnInit {
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService
  ) { 
    this.initStorage();  
   }

  async initStorage() {
    await this.storage.init();
  }

  datum: Data = {
    id : '',
    gps : '',
    path : '',
    notes : '',
    result : 0,
    tags : '',
    date : ''
  }

  source: string = '';

  ngOnInit() {

    // initialize the mapkit API before anything
    const tokenID = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlhBVjVZQzVTUFYifQ.eyJpc3MiOiJaQTVSOVg4NUI1IiwiaWF0IjoxNjUzMzY1NTE5LCJleHAiOjE2NzI0NDQ4MDB9.al1bW4MPG9yom_cEZh13dDyAWnrmuU2QsUo-8_ziE9I-iqydqKBcm5GEbYNgfPSPjaXGsrR4nmlBosbPpgfvxQ";  
      mapkit.init({     
        authorizationCallback: function(done) {         
          done(tokenID);     
    } }); 

    // grab the ID parameter passed through routing from the history page
    var id = this.route.snapshot.paramMap.get('id');
    // grab source that we routed from to get to the sample page for the back button
    this.source = this.route.snapshot.paramMap.get('source');
    
    // grab ID'th index from ionic storage
    this.storage.getItem(id).then((val) => {
      
      this.datum = val;
      this.mapInit();
    });
  }

  mapInit() {

    var gps=this.datum.gps;
      
    var MarkerAnnotation = mapkit.MarkerAnnotation, clickAnnotation;
    var photo = new mapkit.Coordinate(parseFloat(gps.replace(' ','').split(',')[0]), parseFloat(gps.replace(' ','').split(',')[1]));
      
    var map = new mapkit.Map("map", { center: photo });
      
    var photoAnnotation = new MarkerAnnotation(photo, { color: "#f4a56d", title: "Photo ID: " + this.datum.id , selected: true});
    
    map.showItems([photoAnnotation]);
      
    // Drop an annotation where a Shift-click is detected:
    map.element.addEventListener("click", function(event) {
      if(!event.shiftKey) {
        return;
      }
    
      if(clickAnnotation) {
        map.removeAnnotation(clickAnnotation);
      }
    
      var coordinate = map.convertPointOnPageToCoordinate(new DOMPoint(event.pageX, event.pageY));
      clickAnnotation = new MarkerAnnotation(coordinate, {
        title: "",
        color: "#c969e0"
      });
      map.addAnnotation(clickAnnotation);
    });
  }

  back() {
    this.router.navigate([this.source]);
  }

}

// black background                             - yes
// working title: oilix?                        - sure
// ui things                                    - 
// predictor tab                                - no backend
// server functionality                         - 
// get geo data from current location           - yes
// update upload page to handle multiple images - yes
      // display files uploaded better          - 
// add all fields to admin info editing         - 
      // open map and drop pin?                 - 
// interface camera maybe                       - 

// should i add a button to upload to server separately? Or on the backend have it update sometimes