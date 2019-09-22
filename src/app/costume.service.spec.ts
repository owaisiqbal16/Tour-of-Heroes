import { TestBed } from '@angular/core/testing';

import { CostumeService } from './costume.service';

describe('CostumeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CostumeService = TestBed.get(CostumeService);
    expect(service).toBeTruthy();
  });
});
