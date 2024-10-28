import { TestBed } from '@angular/core/testing';

import { SearchLocationService } from './search-location.service';

describe('SearchLocationService', () => {
  let service: SearchLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
