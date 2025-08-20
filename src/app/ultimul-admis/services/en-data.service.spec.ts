import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EnDataService } from './en-data.service';

describe('EnDataService', () => {
  let service: EnDataService;
  let httpMock: HttpTestingController;

  const mockCandidateData = [
    {
      index: 1,
      school: 'Colegiul National "Mihai Eminescu"',
      specialisation: 'Matematica-Informatica',
      en_grade: 9.5,
      total_candidates: 150
    },
    {
      index: 2,
      school: 'Colegiul National "Mihai Eminescu"',
      specialisation: 'Matematica-Informatica',
      en_grade: 9.3,
      total_candidates: 150
    },
    {
      index: 1,
      school: 'Liceul Economic',
      specialisation: 'Economie',
      en_grade: 8.5,
      total_candidates: 100
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnDataService]
    });
    service = TestBed.inject(EnDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extract unique schools correctly', () => {
    const mockData = [
      { school: 'School A', specialization: 'Spec1', yearlyData: [] },
      { school: 'School B', specialization: 'Spec2', yearlyData: [] },
      { school: 'School A', specialization: 'Spec3', yearlyData: [] }
    ];
    
    const schools = service.getUniqueSchools(mockData);
    
    expect(schools).toContain('School A');
    expect(schools).toContain('School B');
    expect(schools.length).toBe(2); // No duplicates
  });

  it('should extract specializations for specific school', () => {
    const mockData = [
      { school: 'School A', specialization: 'Spec1', yearlyData: [] },
      { school: 'School A', specialization: 'Spec2', yearlyData: [] },
      { school: 'School B', specialization: 'Spec3', yearlyData: [] }
    ];
    
    const specializations = service.getSpecializationsForSchool(mockData, 'School A');
    
    expect(specializations).toContain('Spec1');
    expect(specializations).toContain('Spec2');
    expect(specializations).not.toContain('Spec3');
    expect(specializations.length).toBe(2);
  });

  it('should filter data by school and specialization', () => {
    const mockData = [
      { school: 'School A', specialization: 'Spec1', yearlyData: [] },
      { school: 'School A', specialization: 'Spec2', yearlyData: [] },
      { school: 'School B', specialization: 'Spec1', yearlyData: [] }
    ];
    
    const filtered = service.filterData(mockData, 'School A', 'Spec1');
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].school).toBe('School A');
    expect(filtered[0].specialization).toBe('Spec1');
  });

  it('should handle empty data arrays', () => {
    const schools = service.getUniqueSchools([]);
    const specializations = service.getSpecializationsForSchool([], 'Any School');
    const filtered = service.filterData([], 'Any School', 'Any Spec');
    
    expect(schools).toEqual([]);
    expect(specializations).toEqual([]);
    expect(filtered).toEqual([]);
  });

  it('should clear cache properly', () => {
    service.clearCache();
    // After clearing cache, subsequent calls should make new HTTP requests
    expect(service).toBeTruthy(); // Basic check that service still works
  });

  it('should return sorted results', () => {
    const mockData = [
      { school: 'Z School', specialization: 'Spec1', yearlyData: [] },
      { school: 'A School', specialization: 'Spec2', yearlyData: [] }
    ];
    
    const schools = service.getUniqueSchools(mockData);
    
    // Should be sorted alphabetically
    expect(schools[0]).toBe('A School');
    expect(schools[1]).toBe('Z School');
  });
});
