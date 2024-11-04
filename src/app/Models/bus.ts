export class Bus {
    id: number;
    name: string;
    ip?: number;
    type: string;
    buses: string[];


  constructor() {
    this.id = 0;
    this.name = '';
    this.ip = 0;
    this.type = '';
    this.buses = [];
  }
}