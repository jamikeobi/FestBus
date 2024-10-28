import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapsearchService } from '../Services/mapService/mapsearch.service';
import { ActivatedRoute } from '@angular/router';
import { Route } from '../Models/route';
import 'leaflet-routing-machine'

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css'],
})
export class RouteComponent implements OnInit {
  private map: any;

  fromQuery: string = '';
  toQuery: string = '';
  minutesToTravelToDestination: number = 0;

  routeDetails:  Route | null = null;
  selectedRoute: any = true;
  stopsAlongTheWay: any;

  constructor(
    private mapService: MapsearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fromQuery = params['query1'] || '';
      this.toQuery = params['query2'] || '';

      console.log('From:', this.fromQuery);
      console.log('To:', this.toQuery);
      this.retrieveRouteDetails();
      // Get current location and initialize map after geolocation is successful
      this.getCurrentLocation();
    });
  }

  //Retrieve Route Details
  retrieveRouteDetails() {
    // Retrieve route details from localStorage
    const routeDetails = localStorage.getItem('routeDetails');
    if (routeDetails) {
      this.routeDetails = JSON.parse(routeDetails);
      const route: Route = JSON.parse(routeDetails);
      // Use the route details as needed
      console.log('Retrieved route details:', route);
    } else {
      console.error('No route details found.');
    }
  }

  private getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Initialize the map after fetching the user's location
          this.map = L.map('map').setView([latitude, longitude], 13);

          const customIcons = L.icon({
            iconUrl: '../../assets/markerIcons/marker-icon-2x.png',
            shadowUrl: '../../assets/markerIcons/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors', //&copy; OpenStreetMap contributors
          }).addTo(this.map);

          L.marker([latitude, longitude], {icon: customIcons})
            .addTo(this.map)
            .bindPopup('You are here')
            .openPopup();


            if(this.routeDetails && this.routeDetails.toLatitude && this.routeDetails.toLongitude && this.routeDetails.fromLatitude && this.routeDetails.fromLongitude){
              L.marker([this.routeDetails.toLatitude, this.routeDetails.toLongitude], {icon: customIcons})
            .addTo(this.map)
            .bindPopup('Your destination')
            .openPopup();


            // Custom route line options
            const lineOptions = {
              styles: [
                { color: 'green', opacity: 0.8, weight: 3 } // Custom color, opacity, and weight
              ],
              addWaypoints: false, // Disable adding waypoints on the route by clicking
              draggableWaypoints: false, // Disable dragging waypoints
            };

              (L as any).Routing.control({
                waypoints: [
                  L.latLng(latitude, longitude),
                  L.latLng(this.routeDetails.latitude, this.routeDetails.longitude)
                ],
                lineOptions,
                routeWhileDragging: false,
                show: false
              }).on('routesfound', (e: any) => {
                console.log(e);
                const routes = e.routes[0] as any; //This gets the first route

                const timeTakenInSeconds = routes.summary.totalTime;
                const timeTakenInMinutes = Math.round(timeTakenInSeconds / 60);
                this.minutesToTravelToDestination = timeTakenInMinutes;
                this.stopsAlongTheWay = routes.waypoints.map((mapWay: any) => {
                  return {
                    name: mapWay.name,
                    lat: mapWay.latLng.lat,
                    lng: mapWay.latLng.lng
                  };
                });
                console.log('Stops along the way:', this.stopsAlongTheWay);
              }).addTo(this.map);
            }
            
        },
        (error) => {
          console.error('Error getting location', error);
          alert('Unable to retrieve your location. Please try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}
