import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchLocationService } from '../Services/searchLocation/search-location.service';
import { Route } from '../Models/route';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  routeModel!: Route[];
  
  // Properties to store the 'from' and 'to' query inputs
  fromQuery: string = ''; 
  toQuery: string = ''; 

  // Array to hold search results (including start, end, duration, etc.)
  searchResults: Array<{ start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }> = [];

  // Suggestions for 'from' and 'to' location inputs
  locationSuggestionsFrom: Array<{ name: string; type: string; }> = []; 
  locationSuggestionsTo: Array<{ name: string; type: string; }> = []; 

  // Tracks whether the sidebar is open or closed
  isSidebarOpen: boolean = false; 

  // ViewChild to capture the input elements for 'from' and 'to' locations
  @ViewChild('fromInput', { static: false }) fromInput!: ElementRef<HTMLInputElement>;
  @ViewChild('toInput', { static: false }) toInput!: ElementRef<HTMLInputElement>;

  // Constructor to inject the necessary services (Router and ActivatedRoute)
  constructor(private route: ActivatedRoute, private router: Router) {}

  // Inject the search location service manually
  searchLocationService: SearchLocationService = inject(SearchLocationService);

  ngOnInit() {
    // Listen for query parameters (e.g., when coming back to the search page with pre-filled queries)
    this.route.queryParams.subscribe(params => {
      // Capture the 'from' query from URL
      this.fromQuery = params['query']; 

      console.log(this.fromQuery); // Debugging: log the 'from' query value

      // Set the 'from' input field with the captured query value if the input exists
      if (this.fromInput) {
        this.fromInput.nativeElement.value = this.fromQuery;
      }
    });

    // Load recent searches from localStorage when the component initializes
    this.loadRecentSearches();
  }

  // Updates the 'from' input and provides location suggestions
  OnFromInputChange() {
    // Call the search service to get location suggestions
    this.locationSuggestionsFrom = this.searchLocationService.searchLocations(this.fromInput.nativeElement.value);
  }

  // Updates the 'to' input and provides location suggestions
  OnToInputChange() {
    // Call the search service to get location suggestions
    this.locationSuggestionsTo = this.searchLocationService.searchLocations(this.toInput.nativeElement.value);
  }

  // Triggered when the user clicks the search button
  onSearch() {
    // Trim input values from the 'from' and 'to' fields
    const fromQuery = this.fromInput.nativeElement.value.trim();
    const toQuery = this.toInput.nativeElement.value.trim();
  
    // Ensure the inputs have valid values before proceeding
    if (fromQuery.length > 1 && toQuery.length > 1) {
      console.log('Navigating with queries:', fromQuery, toQuery); // Debugging: log the input queries
  
      // Navigate to the '/route' path with query parameters 'query1' and 'query2'
      this.router.navigate(['/route'], { queryParams: { query1: fromQuery, query2: toQuery }});
  
      // Generate current date and time
      const now = new Date(); 
  
      // Randomly calculate duration between 15-75 minutes
      const durationInMinutes = Math.floor(Math.random() * 60) + 15; 
  
      // Calculate expected arrival and drop-off times
      const expectedArrival = new Date(now.getTime() + durationInMinutes * 60000).toLocaleTimeString();
      const expectedDropOff = new Date(now.getTime() + (durationInMinutes + 5) * 60000).toLocaleTimeString();
  
      // Create a result object to hold the search details
      const result = {
        start: fromQuery,
        end: toQuery,
        expectedArrival: expectedArrival,
        expectedDropOff: expectedDropOff,
        duration: `${durationInMinutes} minutes`
      };
  
      // Save the search query in localStorage
      this.saveSearchQuery(result);
  
      // Load the recent searches
      this.loadRecentSearches();
  
      // Get route details and store it
      const routeDetails = this.searchLocationService.getRouteDetails(fromQuery, toQuery);
      if (routeDetails) {
        // Store the route details in a suitable place, e.g., localStorage or a service
        this.storeRouteDetails(routeDetails);
      } else {
        console.error("Route details not found for the specified locations.");
      }
    } else {
      // Handle the case when inputs are invalid
      console.error("Invalid input: both 'from' and 'to' locations must have more than one character.");
    }
  }
  
  // Method to store route details (implement as needed)
  storeRouteDetails(route: Route) {
    // For example, store in localStorage
    localStorage.setItem('routeDetails', JSON.stringify(route));
  }
  

  // Save search query result to localStorage
  saveSearchQuery(result: { start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }): void {
    let searches = JSON.parse(localStorage.getItem('searchResults') || '[]'); // Retrieve existing searches
    searches.push(result); // Add the new search result
    localStorage.setItem('searchResults', JSON.stringify(searches)); // Save updated searches back to localStorage
  }

  // Load recent searches from localStorage
  loadRecentSearches(): void {
    this.searchResults = JSON.parse(localStorage.getItem('searchResults') || '[]'); // Load and parse the stored searches
  }

  // Clears the search history from localStorage and resets the results
  clearSearchHistory(): void {
    localStorage.removeItem('searchResults'); // Remove the searches from localStorage
    this.searchResults = []; // Clear the array holding the search results
  }

  // Remove a specific search query based on index
  removeSearchQuery(index: number) {
    let searches = JSON.parse(localStorage.getItem('searchResults') || '[]'); // Retrieve searches
    searches.splice(index, 1); // Remove the selected search by index
    localStorage.setItem('searchResults', JSON.stringify(searches)); // Save the updated search list back to localStorage
    this.loadRecentSearches(); // Reload the updated list
  }

  // Clear both input fields ('from' and 'to')
  clearInput() {
    this.fromQuery = ''; // Reset 'from' query
    this.toQuery = ''; // Reset 'to' query
    if (this.fromInput) this.fromInput.nativeElement.value = ''; // Clear the 'from' input field
    if (this.toInput) this.toInput.nativeElement.value = ''; // Clear the 'to' input field
  }

  // Use geolocation to set the 'from' query to the user's current location
  useCurrentLocation() {
    if (navigator.geolocation) { // Check if geolocation is supported
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords; // Get latitude and longitude from the geolocation API
        this.fromQuery = `Current Location (${latitude}, ${longitude})`; // Set 'from' query with current location coordinates
        if (this.fromInput) this.fromInput.nativeElement.value = this.fromQuery; // Set input value
      }, (error) => {
        // Handle errors if geolocation fails
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      });
    } else {
      alert('Geolocation is not supported by this browser.'); // If geolocation is not supported
    }
  }

  // Toggle the sidebar state (open/close)
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle the boolean flag
  }

  // Select a location suggestion and move to the 'to' input
  selectSuggestion(suggestion: { name: string; type: string }) {
    this.fromQuery = suggestion.name; // Set the 'from' query with the selected suggestion
    this.toInput.nativeElement.focus(); // Focus on the 'to' input field
    this.locationSuggestionsFrom = []; // Clear location suggestions after selection
  }
}
