import { query } from '@angular/animations';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchLocationService {
  private Locations = [
    { name: '1st Avenue', type: 'Avenue' },
    { name: '2nd Avenue', type: 'Avenue' },
    { name: '3rd Avenue', type: 'Avenue' },
    { name: '4th Avenue', type: 'Avenue' },
    { name: '5th Avenue', type: 'Avenue' },
    { name: '6th Avenue', type: 'Avenue' },
    { name: '7th Avenue', type: 'Avenue' },
    { name: '8th Avenue', type: 'Avenue' },
    { name: '9th Avenue', type: 'Avenue' },
    { name: '10th Avenue', type: 'Avenue' },
    { name: '1st Close', type: 'Close' },
    { name: '2nd Close', type: 'Close' },
    { name: '3rd Close', type: 'Close' },
    { name: '4th Close', type: 'Close' },
    { name: '5th Close', type: 'Close' },
    { name: 'Adesola Street', type: 'Street' },
    { name: 'Adeleke Street', type: 'Street' },
    { name: 'Alakija Street', type: 'Street' },
    { name: 'Babajide Street', type: 'Street' },
    { name: 'Bola Ahmed Tinubu Avenue', type: 'Avenue' },
    { name: 'Bola Ige Avenue', type: 'Avenue' },
    { name: 'Coconut Road', type: 'Road' },
    { name: 'Cocoa Road', type: 'Road' },
    { name: 'Davidson Street', type: 'Street' },
    { name: 'Egbeada Close', type: 'Close' },
    { name: 'Fola Osibo Close', type: 'Close' },
    { name: 'Giwa Street', type: 'Street' },
    { name: 'Ibadan Street', type: 'Street' },
    { name: 'Ibukunoluwa Street', type: 'Street' },
    { name: 'Jibowu Street', type: 'Street' },
    { name: 'Kolawole Street', type: 'Street' },
    { name: 'Lagos-Apapa Expressway', type: 'Road' },
    { name: 'Mokola Street', type: 'Street' },
    { name: 'Niyi Adewunmi Street', type: 'Street' },
    { name: 'Oba Oyinlola Street', type: 'Street' },
    { name: 'Obasanjo Road', type: 'Road' },
    { name: 'Olajide Street', type: 'Street' },
    { name: 'Osun State Road', type: 'Road' },
    { name: 'Sanyaolu Street', type: 'Street' },
    { name: 'Sikiru Adetola Street', type: 'Street' },
    { name: 'Sobo Adebayo Street', type: 'Street' },
    { name: 'Tayo Street', type: 'Street' },
    { name: 'Victoria Street', type: 'Street' },
    { name: 'Wasiu Street', type: 'Street' },
    { name: 'Yusuf Street', type: 'Street' },
    { name: 'Zahra Close', type: 'Close' },
    { name: 'NBS Street', type: 'Street' },
    { name: 'Mosley Street', type: 'Street' },
    { name: 'Raji Street', type: 'Street' },
    { name: 'Salau Close', type: 'Close' },
    { name: 'Odunfa Close', type: 'Close' },
    { name: 'Festac Link Road', type: 'Road' },
    { name: 'Last Floor Street', type: 'Street' },
    { name: 'Kehinde Street', type: 'Street' },
    { name: 'Olasunkanmi Street', type: 'Street' },
    { name: 'Adejare Street', type: 'Street' },
    { name: 'Lere Street', type: 'Street' },
  ];
  constructor() {}

  //Function to filter and search for locations
  searchLocations(query: string) {
    if (!query) return [];
    return this.Locations.filter((location) =>
      location.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
}
