import { TestBed } from '@angular/core/testing';

import { WDetailsService } from './w-details.service';

describe('WDetailsService', () => {
  let service: WDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
