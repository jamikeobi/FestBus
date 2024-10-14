import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchLocationService } from '../Services/Map_Service/SearchLocationService/search-location.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    // Properties to hold input values and search results
    fromQuery: string = ''; 
    toQuery: string = ''; 
    searchResults: Array<{ start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }> = [];
    locationSuggestionsFrom: Array<{ name: string; type: string; }> = []; 
    locationSuggestionsTo: Array<{ name: string; type: string; }> = []; 
    isSidebarOpen: boolean = false; // Boolean to track sidebar state
  
    // ViewChild to reference the input elements in the template
    @ViewChild('fromInput', { static: false }) fromInput!: ElementRef<HTMLInputElement>;
    @ViewChild('toInput', { static: false }) toInput!: ElementRef<HTMLInputElement>;
  
    // Constructor to inject dependencies
    constructor(private route: ActivatedRoute, private searchLocationService: SearchLocationService) {}
  
    // Lifecycle hook that runs after component initialization
    ngOnInit() {
      // Subscribe to the query parameters in the route
      this.route.queryParams.subscribe(params => {
        this.fromQuery = params['query']; // Get the 'query' parameter
  
        // Set the value of the 'from' input element if it exists
        if (this.fromInput) {
          this.fromInput.nativeElement.value = this.fromQuery;
        }
      });
      this.loadRecentSearches(); // Load recent searches from localStorage
    }
  
    // Method to handle changes in the 'from' input field
    OnFromInputChange() {
      // Update location suggestions based on the input value
      this.locationSuggestionsFrom = this.searchLocationService.searchLocations(this.fromInput.nativeElement.value);
    }
  
    // Method to handle changes in the 'to' input field
    OnToInputChange() {
      // Update location suggestions based on the input value
      this.locationSuggestionsTo = this.searchLocationService.searchLocations(this.toInput.nativeElement.value);
    }
  
    // Method to perform the search when the user clicks the search button
    onSearch() {
      // Trim whitespace from input values
      this.fromQuery = this.fromInput.nativeElement.value.trim();
      this.toQuery = this.toInput.nativeElement.value.trim();
  
      // Check if both input queries are valid
      if (this.fromQuery.length > 1 && this.toQuery.length > 1) {
        const now = new Date(); // Get the current date and time
        const durationInMinutes = Math.floor(Math.random() * 60) + 15; // Random duration between 15-75 minutes
        const expectedArrival = new Date(now.getTime() + durationInMinutes * 60000).toLocaleTimeString(); // Calculate expected arrival time
        const expectedDropOff = new Date(now.getTime() + (durationInMinutes + 5) * 60000).toLocaleTimeString(); // Calculate expected drop-off time
  
        // Create a result object with search details
        const result = {
          start: this.fromQuery,
          end: this.toQuery,
          expectedArrival: expectedArrival,
          expectedDropOff: expectedDropOff,
          duration: `${durationInMinutes} minutes` // Duration as a string
        };
  
        this.saveSearchQuery(result); // Save the search query to localStorage
        this.loadRecentSearches(); // Reload recent searches
      }
    }
  
    // Method to save the search query to localStorage
    saveSearchQuery(result: { start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }): void {
      let searches = JSON.parse(localStorage.getItem('searchResults') || '[]'); // Retrieve existing searches
      searches.push(result); // Add the new search result
      localStorage.setItem('searchResults', JSON.stringify(searches)); // Save updated searches to localStorage
    }
  
    // Method to load recent searches from localStorage
    loadRecentSearches(): void {
      this.searchResults = JSON.parse(localStorage.getItem('searchResults') || '[]'); // Load searches
    }
  
    // Method to clear the search history
    clearSearchHistory(): void {
      localStorage.removeItem('searchResults'); // Remove searches from localStorage
      this.searchResults = []; // Clear the local array
    }
  
    // Method to remove a specific search query based on index
    removeSearchQuery(index: number) {
      let searches = JSON.parse(localStorage.getItem('searchResults') || '[]'); // Load existing searches
      searches.splice(index, 1); // Remove the search at the specified index
      localStorage.setItem('searchResults', JSON.stringify(searches)); // Save updated searches to localStorage
      this.loadRecentSearches(); // Reload recent searches
    }
  
    // Method to clear both input fields
    clearInput() {
      this.fromQuery = ''; // Clear the fromQuery
      this.toQuery = ''; // Clear the toQuery
      if (this.fromInput) this.fromInput.nativeElement.value = ''; // Clear the input field for 'from'
      if (this.toInput) this.toInput.nativeElement.value = ''; // Clear the input field for 'to'
    }
  
    // Method to use the current geolocation as the starting point
    useCurrentLocation() {
      if (navigator.geolocation) { // Check if geolocation is supported
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords; // Get latitude and longitude
          this.fromQuery = `Current Location (${latitude}, ${longitude})`; // Update fromQuery with current location
          if (this.fromInput) this.fromInput.nativeElement.value = this.fromQuery; // Set input value
        }, (error) => {
          console.error('Error getting location', error); // Log error if geolocation fails
          alert('Unable to retrieve your location. Please try again.'); // Alert user
        });
      } else {
        alert('Geolocation is not supported by this browser.'); // Alert if geolocation is unsupported
      }
    }
  
    // Method to toggle the sidebar open/close
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar state
    }
  
    // Method to select a location suggestion
    selectSuggestion(suggestion: { name: string; type: string }) {
      this.fromQuery = suggestion.name; // Update input with selected suggestion
      this.toInput.nativeElement.focus(); // Focus on the next input field ('to')
      this.locationSuggestionsFrom = []; // Clear suggestions after selection
    }
}
