import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.css']
})
export class BusListComponent implements OnInit {
  buses = [
    { id: 1, name: 'Ivanhoe Crescent', description: '1 min walk towards Silverknowes', time: '18 min' }
    // { id: 2, name: 'Glenvarloch Crescent', description: '16 min walk towards Mayfield or Gorebridge', time: '16 min' },
    // { id: 3, name: 'Mayfield', description: 'Bus 3, towards central', time: '40 min' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
