import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BacDataService } from './bac-data.service';
import { BacCacheService } from '../../services/bac.cache.service';
import { BacCandidate } from '../../model/bac.candidate';

describe('BacDataService', () => {
  let service: BacDataService;
  let mockBacCacheService: jasmine.SpyObj<BacCacheService>;

  const mockBacCandidate: BacCandidate = {
    index: 1,
    code: 'ABC123',
    posJud: 1,
    posTara: 1,
    school: 'Test School',
    county: 'AB',
    promotie_anterioara: 'Nu',
    forma_invatamant: 'Zi',
    specializare: 'Matematica-Informatica',
    LR: 9.50,
    LM: 8.75,
    DO: 9.25,
    DA: 8.90,
    final_avg: 9.02,
    final_res: 'ADMIS'
  };

  const mockRawData = [
    ['1', 'ABC123', '1', '1', 'Test School', 'Nu', 'Zi', 'Matematica-Informatica', '', '', '9.50', '8.75', '', '', '', '9.25', '8.90', '', '9.02', 'ADMIS'],
    ['2', 'DEF456', '2', '2', 'Another School', 'Nu', 'Zi', 'Stiinte Economice', '', '', '7.50', '6.75', '', '', '', '7.25', '6.90', '', '7.02', 'ADMIS']
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BacCacheService', ['init', 'getCountyData']);

    TestBed.configureTestingModule({
      providers: [
        BacDataService,
        { provide: BacCacheService, useValue: spy }
      ]
    });

    service = TestBed.inject(BacDataService);
    mockBacCacheService = TestBed.inject(BacCacheService) as jasmine.SpyObj<BacCacheService>;

    // Setup default returns
    mockBacCacheService.init.and.returnValue(of([]));
    mockBacCacheService.getCountyData.and.returnValue([mockBacCandidate]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return sorted counties with names', async () => {
    const counties = await service.getAvailableCounties();
    
    expect(counties.length).toBeGreaterThan(0);
    expect(counties[0].code).toBeDefined();
    expect(counties[0].name).toBeDefined();
    
    // Should be sorted by name
    for (let i = 1; i < counties.length; i++) {
      expect(counties[i].name.localeCompare(counties[i-1].name)).toBeGreaterThanOrEqual(0);
    }
    
    // Check specific counties exist
    const codes = counties.map(c => c.code);
    expect(codes).toContain('AB'); // Alba
    expect(codes).toContain('B');  // Bucuresti
  });

  it('should handle data loading correctly', async () => {
    // Empty county
    let result = await service.loadData('');
    expect(result).toEqual([]);
    
    // Valid county with cache initialization
    result = await service.loadData('AB');
    
    expect(mockBacCacheService.init).toHaveBeenCalled();
    expect(mockBacCacheService.getCountyData).toHaveBeenCalledWith('AB');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle null values in candidate data', async () => {
    const candidateWithNulls: BacCandidate = {
      ...mockBacCandidate,
      LM: null,
      final_avg: null
    };
    
    mockBacCacheService.getCountyData.and.returnValue([candidateWithNulls]);
    
    const result = await service.loadData('AB');
    
    expect(result[0][11]).toBe(''); // LM should be empty string
    expect(result[0][18]).toBe(''); // final_avg should be empty string
  });

  it('should extract unique school names', () => {
    const schools = service.getSchools(mockRawData);
    
    expect(schools).toContain('Test School');
    expect(schools).toContain('Another School');
    expect(schools.length).toBe(2);
  });

  it('should extract unique specialisation names', () => {
    const specialisations = service.getSpecialisations(mockRawData);
    
    expect(specialisations).toContain('Matematica-Informatica');
    expect(specialisations).toContain('Stiinte Economice');
    expect(specialisations.length).toBe(2);
  });

  it('should filter data correctly', () => {
    // Filter by school only
    let filtered = service.filterData(mockRawData, 'Test School', 'Toate');
    expect(filtered.length).toBe(1);
    expect(filtered[0][4]).toBe('Test School');
    
    // Filter by specialisation only
    filtered = service.filterData(mockRawData, 'Toate', 'Stiinte Economice');
    expect(filtered.length).toBe(1);
    expect(filtered[0][7]).toBe('Stiinte Economice');
    
    // Filter by both
    filtered = service.filterData(mockRawData, 'Test School', 'Matematica-Informatica');
    expect(filtered.length).toBe(1);
    
    // Show all
    filtered = service.filterData(mockRawData, 'Toate', 'Toate');
    expect(filtered.length).toBe(2);
  });

  it('should handle empty data arrays', () => {
    const schools = service.getSchools([]);
    const specialisations = service.getSpecialisations([]);
    const filtered = service.filterData([], 'Test', 'Test');
    
    expect(schools).toEqual([]);
    expect(specialisations).toEqual([]);
    expect(filtered).toEqual([]);
  });

  it('should remove duplicates from extracted values', () => {
    const dataWithDuplicates = [
      ...mockRawData,
      ['3', 'GHI789', '3', '3', 'Test School', 'Nu', 'Zi', 'Matematica-Informatica', '', '', '8.50', '7.75', '', '', '', '8.25', '7.90', '', '8.02', 'ADMIS']
    ];
    
    const schools = service.getSchools(dataWithDuplicates);
    const specialisations = service.getSpecialisations(dataWithDuplicates);
    
    expect(schools.filter(s => s === 'Test School').length).toBe(1);
    expect(specialisations.filter(s => s === 'Matematica-Informatica').length).toBe(1);
  });
});
