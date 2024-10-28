import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MapsearchService } from '../Services/mapService/mapsearch.service';
import { SearchLocationService } from '../Services/searchLocation/search-location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private map: any;
 locations$!: Observable<any[]>
 
 @ViewChild('searchInput') searchInput!: ElementRef;

 searchQuery: string = '';


 
  constructor(private mapService: MapsearchService, private router: Router, private searchLocationService: SearchLocationService) {}

  // Initialize the map
  ngOnInit() {
    this.mapService.initMap();
    this.getCurrentLocation();
    this.locations$ = this.searchLocationService.getLocations()
  }
  




   // Get the user's current location
   private getCurrentLocation(): void {
    this.mapService.getCurrentLocation();
  }


  //Search Location in the map
  searchLocation(searchText: string) {
    this.mapService.searchLocation(searchText).subscribe(location => {
      const {lat, lon} = location[0];
      const searchMarker = L.marker([lat, lon]).addTo(this.map)
      this.map.setView([lat, lon], 13);
    })
  }


   // Function to navigate to the search page after typing 3 or more letters on the search input on the home page
   onSearch(event: Event){
    const InputElement = event.target as HTMLInputElement;
    this.searchQuery = InputElement.value;

    // I am now checking if the input contains 3 or more words
    const words = this.searchQuery.trim();
    if(words.length >= 3){
      this.navigateToSearch();
    }
  }

   // Method to navigate to search page when the button is clicked
   onSearchClickButton(): void {
    this.searchQuery = this.searchInput.nativeElement.value;
    this.navigateToSearch();
  }

  // Navigation method
  private navigateToSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
  }
}
