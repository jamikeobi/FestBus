export class Route {
    id: number;
    name: string;
    from?: string;
    to?: string;
    ip?: number;
    type: string;
    latitude: number;
    longitude: number;
    fromLatitude?: number;
    toLatitude?: number;
    fromLongitude?: number;
    toLongitude?: number;
    stops?: string;
    buses: string[];


  constructor() {
    this.id = 0;
    this.name = '';
    this.from = '';
    this.to = '';
    this.ip = 0;
    this.type = '';
    this.latitude = 0;
    this.longitude = 0;
    this.fromLatitude = 0;
    this.fromLongitude = 0;
    this.toLatitude = 0;
    this.toLongitude = 0;
    this.stops = '';
    this.buses = [];
  }
}