import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapsearchService } from '../Services/mapService/mapsearch.service';
import { ActivatedRoute } from '@angular/router';
import { Route } from '../Models/route';
import 'leaflet-routing-machine'
import { SearchLocationService } from '../Services/searchLocation/search-location.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css'],
})
export class RouteComponent implements OnInit {
  private map: any;
  locations$!: Observable<any[]>;
  showMore: boolean = false;
  showStops: boolean = false;
  fromQuery: string = '';
  toQuery: string = '';
  minutesToTravelToDestination: number = 0;
  buses: string[] = []; //to hold bus array
  firstTwoBuses: string[] = []; //to hold the first 2 buses

  stopName: string = '';
  lat: number = 0;
  lon: number = 0;
  routeDetails:  Route | null = null;
  selectedRoute: any = true;
  stopsAlongTheWays:boolean = false;
  selectedBuses: string[] = [];
  showMoreBuses: string[] = [];
  isLoading: boolean = false;

  constructor(
    private mapService: MapsearchService,
    private searchLocationService: SearchLocationService,
    private route: ActivatedRoute
  ) {}

  
  

  ngOnInit(): void {
    this.isLoading = true;
  
    // Listen for query parameters
    this.route.queryParams.subscribe((params) => {
      this.fromQuery = params['query1'] || '';
      this.toQuery = params['query2'] || '';
  
      console.log('From:', this.fromQuery);
      console.log('To:', this.toQuery);
  
      // If both 'fromQuery' and 'toQuery' are missing, initialize the map with default location
      if (!this.fromQuery || !this.toQuery) {
        console.warn('One or both of the query parameters (from or to) are missing.');
        this.locations$ = this.searchLocationService.getLocations()
        this.initializeMapWithDefaultLocation(); // Initialize the map with default location
      } else {
        // If both queries are present, proceed with usual logic (retrieve route details)
        this.retrieveRouteDetails();
      }
    });
  
    // Get current location and initialize map after geolocation is successful
    this.getCurrentLocation();
  }
  
  private initializeMapWithDefaultLocation() {
    // Initialize map with a default location (e.g., Festac Town) only when no query parameters are provided
  
    const customIcons = L.icon({
      iconUrl: '../../assets/markerIcons/marker-icon-2x.png',
      shadowUrl: '../../assets/markerIcons/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  
    L.marker([6.4971, 3.3483], { icon: customIcons })
      .addTo(this.map)
      .bindPopup('Festac Axis')
      .openPopup();
  }
  


  
  
  
  onClosePopup(){
    this.stopsAlongTheWays = false;
  }

  showMoreStops() {
    this.showStops = !this.showStops; // Toggle visibility of the additional stops
  }
  
  
  onBusClick(index: number) {
    this.stopsAlongTheWays = !this.stopsAlongTheWays;
  
    if (this.stopsAlongTheWays) {
      // Get the stops for the selected bus
      this.selectedBuses = this.searchLocationService.getRandomStops(5);
      console.log('Stops for selected bus:', this.selectedBuses);
  
      if (index === 1) {
        this.showMore = true;
        this.showMoreBuses = this.searchLocationService.getRandomStops(4); // Fetch additional stops for the second bus
      } else {
        this.showMore = false;
      }
    }
  }
  
  
  

  //Retrieve Route Details
  retrieveRouteDetails() {
    // Retrieve route details from localStorage
    const routeDetails = localStorage.getItem('routeDetails');
    if (routeDetails) {
      this.routeDetails = JSON.parse(routeDetails);
      const route: Route = JSON.parse(routeDetails);
      this.buses = route.buses
      console.log('Buses',this.buses);

      this.firstTwoBuses = this.buses.splice(0,2);
      console.log('First two buses:', this.firstTwoBuses);
      // Use the route details as needed
      console.log('Retrieved route details:', route);
    } else {
      console.error('No route details found.');
    }
  }

  // getBusesForStartLocation(){
  //   this.buses = this.
  // }

  private getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let latitude: number;
          let longitude: number;
  
          // Check if routeDetails exist and contain valid coordinates
          if (this.routeDetails && this.routeDetails.fromLatitude && this.routeDetails.fromLongitude) {
            this.isLoading = true;
            latitude = this.routeDetails.fromLatitude;
            longitude = this.routeDetails.fromLongitude;
            this.isLoading = false;
            // this.isLoading = false;
            console.log("Using routeDetails coordinates as initial position:", latitude, longitude);
          } else {
            // Fall back to user's current location if routeDetails are missing or incomplete
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log("Using user's current location as initial position:", latitude, longitude);
          }
  
          // Initialize the map at the starting coordinates
          this.map = L.map('map').setView([latitude, longitude], 15);
  
          const customIcons = L.icon({
            iconUrl: '../../assets/markerIcons/marker-icon-2x.png',
            shadowUrl: '../../assets/markerIcons/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
  
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
          }).addTo(this.map);
  
          // Add marker for the starting location
          L.marker([latitude, longitude], { icon: customIcons })
            .addTo(this.map)
            .bindPopup('Festac Axis')
            .openPopup();
  
          if (this.routeDetails && this.routeDetails.toLatitude && this.routeDetails.toLongitude) {
            // Log destination coordinates for debugging
            console.log("Destination coordinates:", this.routeDetails.toLatitude, this.routeDetails.toLongitude);
  
            // Add marker for the destination
            L.marker([this.routeDetails.toLatitude, this.routeDetails.toLongitude], { icon: customIcons })
              .addTo(this.map)
              .bindPopup('Your destination')
              .openPopup();
  
            // Define custom route line options
            const lineOptions = {
              styles: [{ color: 'green', opacity: 0.8, weight: 3 }],
              addWaypoints: false,
              draggableWaypoints: false,
            };
  
            // Add routing control to the map
            const routingControl = (L as any).Routing.control({
              waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(this.routeDetails.toLatitude, this.routeDetails.toLongitude)
              ],
              lineOptions,
              routeWhileDragging: false,
              show: false
            })
            .on('routesfound', (e: any) => {
              this.isLoading = true;
              const route = e.routes[0];
  
              // Log the found route details for debugging
              console.log('Route found:', route);
              this.minutesToTravelToDestination = Math.round(route.summary.totalTime / 60);
              console.log('Minutes to travel:', this.minutesToTravelToDestination);
              // this.isLoading = false;
            }).addTo(this.map);
  
            // Debugging log to check if routing control is properly added
            console.log('Routing control added to map');
          } else {
            console.error("Route details or destination coordinates are missing.");
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  
  

}
