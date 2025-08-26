import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UltimulAdmisComponent } from './ultimul-admis.component';
import { EnDataService, SchoolSpecialization } from './services/en-data.service';
import { UltimulAdmisFiltersComponent, UltimulAdmisFilters } from './ultimul-admis-filters/ultimul-admis-filters.component';
import { UltimulAdmisTableComponent } from './ultimul-admis-table/ultimul-admis-table.component';
import { UltimulAdmisChartComponent } from './ultimul-admis-chart/ultimul-admis-chart.component';

describe('UltimulAdmisComponent', () => {
  let component: UltimulAdmisComponent;
  let fixture: ComponentFixture<UltimulAdmisComponent>;
  let enDataServiceSpy: jasmine.SpyObj<EnDataService>;

  const mockSchoolSpecializationData: SchoolSpecialization[] = [
    {
      school: 'Colegiul National "Mihai Eminescu"',
      specialization: 'Matematica-Informatica',
      yearlyData: [
        { year: 2022, lastAdmittedIndex: 120, lastAdmittedGrade: 9.5, totalCandidates: 150 },
        { year: 2023, lastAdmittedIndex: 110, lastAdmittedGrade: 9.6, totalCandidates: 140 }
      ]
    },
    {
      school: 'Liceul Economic',
      specialization: 'Economie',
      yearlyData: [
        { year: 2022, lastAdmittedIndex: 200, lastAdmittedGrade: 8.5, totalCandidates: 250 },
        { year: 2023, lastAdmittedIndex: 180, lastAdmittedGrade: 8.7, totalCandidates: 230 }
      ]
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EnDataService', [
      'clearCache',
      'processAdmissionData',
      'getUniqueSchools',
      'getSpecializationsForSchool',
      'filterData'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        UltimulAdmisComponent,
        UltimulAdmisFiltersComponent,
        UltimulAdmisTableComponent,
        UltimulAdmisChartComponent
      ],
      providers: [
        { provide: EnDataService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UltimulAdmisComponent);
    component = fixture.componentInstance;
    enDataServiceSpy = TestBed.inject(EnDataService) as jasmine.SpyObj<EnDataService>;

    // Setup default spy returns
    enDataServiceSpy.processAdmissionData.and.returnValue(Promise.resolve(mockSchoolSpecializationData));
    enDataServiceSpy.getUniqueSchools.and.returnValue(['Colegiul National "Mihai Eminescu"', 'Liceul Economic']);
    enDataServiceSpy.getSpecializationsForSchool.and.returnValue(['Matematica-Informatica']);
    enDataServiceSpy.filterData.and.returnValue([mockSchoolSpecializationData[0]]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isLoading).toBeFalse();
    expect(component.allData).toEqual([]);
    expect(component.filteredData).toEqual([]);
    expect(component.availableSchools).toEqual([]);
    expect(component.availableSpecializations).toEqual([]);
    expect(component.currentFilters).toEqual({
      school: '',
      specialization: '',
      selectedCombinations: []
    });
  });

  it('should load data on initialization', async () => {
    await component.ngOnInit();

    expect(enDataServiceSpy.clearCache).toHaveBeenCalled();
    expect(enDataServiceSpy.processAdmissionData).toHaveBeenCalled();
    expect(component.allData).toEqual(mockSchoolSpecializationData);
    expect(component.availableSchools.length).toBeGreaterThan(0);
  });

  it('should handle data loading errors', async () => {
    enDataServiceSpy.processAdmissionData.and.returnValue(Promise.reject(new Error('Load failed')));
    spyOn(console, 'error');

    await component.ngOnInit();

    expect(component.isLoading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should set loading state correctly during data loading', async () => {
    enDataServiceSpy.processAdmissionData.and.returnValue(
      new Promise(resolve => setTimeout(() => resolve(mockSchoolSpecializationData), 100))
    );

    const promise = component.ngOnInit();
    
    expect(component.isLoading).toBeTrue();
    
    await promise;
    
    expect(component.isLoading).toBeFalse();
  });

  it('should apply filters correctly', () => {
    component.allData = mockSchoolSpecializationData;
    const filters: UltimulAdmisFilters = {
      school: 'Colegiul National "Mihai Eminescu"',
      specialization: 'Matematica-Informatica',
      selectedCombinations: []
    };

    component.onFiltersChange(filters);

    expect(component.currentFilters).toEqual(filters);
    expect(component.filteredData.length).toBeGreaterThan(0);
  });

  it('should handle multiple filter combinations', () => {
    component.allData = mockSchoolSpecializationData;
    const filters: UltimulAdmisFilters = {
      school: '',
      specialization: '',
      selectedCombinations: [
        { school: 'Colegiul National "Mihai Eminescu"', specialization: 'Matematica-Informatica' },
        { school: 'Liceul Economic', specialization: 'Economie' }
      ]
    };

    component.onFiltersChange(filters);

    expect(component.currentFilters).toEqual(filters);
    expect(component.filteredData).toBeDefined();
  });

  it('should provide navigation functionality', () => {
    spyOn(window.history, 'back');
    
    component.goBack();
    
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should update available options when filters change', () => {
    component.allData = mockSchoolSpecializationData;
    const filters: UltimulAdmisFilters = {
      school: 'Colegiul National "Mihai Eminescu"',
      specialization: '',
      selectedCombinations: []
    };

    component.onFiltersChange(filters);

    expect(enDataServiceSpy.getUniqueSchools).toHaveBeenCalledWith(mockSchoolSpecializationData);
    expect(enDataServiceSpy.getSpecializationsForSchool).toHaveBeenCalledWith(mockSchoolSpecializationData, filters.school);
  });
});
