import { TestBed } from '@angular/core/testing';

import { MapsearchService } from './mapsearch.service';

describe('MapsearchService', () => {
  let service: MapsearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapsearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
