import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MapsearchService } from '../Services/mapService/mapsearch.service';
import { SearchLocationService } from '../Services/searchLocation/search-location.service';
import { Route } from '../Models/route';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private map: any;
 locations$!: Observable<any[]>;
 closestBusStop!: Route | null; // to closest bus stop
  availableBus!: string | null; // this is to show available bus from the closest bus stop
  loadingClosestBusStop: boolean = false;
  isLoading: boolean = false;


 
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
    this.mapService.getCurrentLocation().then((location) => {
      this.isLoading = true;
      const { latitude, longitude } = location; // Extract latitude and longitude
      this.getClosestBusStop(latitude, longitude); // Get closest bus stop after getting the user's location
    }).catch(error => {
      console.error('Error getting current location:', error);
    });
  }
  

  // Get the closest bus stop to the user's location
  private getClosestBusStop(lat: number, lon: number): void {
    this.isLoading = true;
    this.loadingClosestBusStop = true; // Set loading state to true
    this.searchLocationService.getClosestBusStop(lat, lon).subscribe(
      busStop => {
        console.log('Closest bus stop:', busStop);
        this.closestBusStop = busStop;
        if (busStop) {
          this.availableBus = busStop.buses[0];
        }
        this.loadingClosestBusStop = false; // Reset loading state after data is fetched
      },
      error => {
        console.error('Error fetching closest bus stop:', error);
        this.closestBusStop = null;
        this.availableBus = null;
        this.loadingClosestBusStop = false; // Reset loading state on error
      }
    );
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
