import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchLocationService } from '../Services/Map_Service/SearchLocationService/search-location.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  fromQuery: string = ''; 
  toQuery: string = ''; 
  searchResults: Array<{ start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }> = [];
  locationSuggestionsFrom: Array<{ name: string; type: string; }> = []; 
  locationSuggestionsTo: Array<{ name: string; type: string; }> = []; 
  isSidebarOpen: boolean = false; 
  

  @ViewChild('fromInput', { static: false }) fromInput!: ElementRef<HTMLInputElement>;
  @ViewChild('toInput', { static: false }) toInput!: ElementRef<HTMLInputElement>;

  constructor(private route: ActivatedRoute, private searchLocationService: SearchLocationService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fromQuery = params['query'];

      if (this.fromInput) {
        this.fromInput.nativeElement.value = this.fromQuery;
      }
    });
    this.loadRecentSearches();
  }

  OnFromInputChange() {
    this.locationSuggestionsFrom = this.searchLocationService.searchLocations(this.fromInput.nativeElement.value);
  }

  OnToInputChange() {
    this.locationSuggestionsTo = this.searchLocationService.searchLocations(this.toInput.nativeElement.value);
  }

  onSearch() {
    this.fromQuery = this.fromInput.nativeElement.value.trim();
    this.toQuery = this.toInput.nativeElement.value.trim();

    if (this.fromQuery.length > 1 && this.toQuery.length > 1) {
      const now = new Date();
      const durationInMinutes = Math.floor(Math.random() * 60) + 15;
      const expectedArrival = new Date(now.getTime() + durationInMinutes * 60000).toLocaleTimeString();
      const expectedDropOff = new Date(now.getTime() + (durationInMinutes + 5) * 60000).toLocaleTimeString();

      const result = {
        start: this.fromQuery,
        end: this.toQuery,
        expectedArrival: expectedArrival,
        expectedDropOff: expectedDropOff,
        duration: `${durationInMinutes} minutes`
      };

      this.saveSearchQuery(result);
      this.loadRecentSearches();
    }
  }

  saveSearchQuery(result: { start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }): void {
    let searches = JSON.parse(localStorage.getItem('searchResults') || '[]');
    searches.push(result);
    localStorage.setItem('searchResults', JSON.stringify(searches));
  }

  loadRecentSearches(): void {
    this.searchResults = JSON.parse(localStorage.getItem('searchResults') || '[]');
  }

  clearSearchHistory(): void {
    localStorage.removeItem('searchResults');
    this.searchResults = [];
  }

  removeSearchQuery(index: number) {
    let searches = JSON.parse(localStorage.getItem('searchResults') || '[]');
    searches.splice(index, 1);
    localStorage.setItem('searchResults', JSON.stringify(searches));
    this.loadRecentSearches();
  }

  clearInput() {
    this.fromQuery = '';
    this.toQuery = '';
    if (this.fromInput) this.fromInput.nativeElement.value = '';
    if (this.toInput) this.toInput.nativeElement.value = '';
  }

  useCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.fromQuery = `Current Location (${latitude}, ${longitude})`;
        if (this.fromInput) this.fromInput.nativeElement.value = this.fromQuery;
      }, (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  selectSuggestion(suggestion: { name: string; type: string }) {
    this.fromQuery = suggestion.name; // Update input
    this.toInput.nativeElement.focus(); // Optionally, focus on the next input
    this.locationSuggestionsFrom = []; // Clear suggestions after selection
  }
  
}
