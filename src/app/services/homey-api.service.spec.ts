import { TestBed } from '@angular/core/testing';

import { HomeyApiService } from './homey-api.service';

describe('HomeyApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HomeyApiService = TestBed.get(HomeyApiService);
    expect(service).toBeTruthy();
  });
});
