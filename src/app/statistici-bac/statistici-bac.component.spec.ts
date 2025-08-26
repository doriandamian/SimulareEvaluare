import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StatisticiBACComponent } from './statistici-bac.component';
import { BacDataService, CountyOption } from './services/bac-data.service';
import { FiltersComponent } from './components/filters/filters.component';
import { ChartComponent } from './components/chart/chart.component';
import { SummaryComponent } from './components/summary/summary.component';

describe('StatisticiBACComponent', () => {
  let component: StatisticiBACComponent;
  let fixture: ComponentFixture<StatisticiBACComponent>;
  let mockBacDataService: jasmine.SpyObj<BacDataService>;

  const mockCounties: CountyOption[] = [
    { code: 'AB', name: 'Alba' },
    { code: 'AR', name: 'Arad' },
    { code: 'B', name: 'Bucuresti' }
  ];

  const mockRawData = [
    ['1', 'ABC123', '1', '1', 'Colegiul National', 'Nu', 'Zi', 'Matematica-Informatica', '', '', '9.50', '8.75', '', '', '', '9.25', '8.90', '', '9.02', 'ADMIS'],
    ['2', 'DEF456', '2', '2', 'Liceul Economic', 'Nu', 'Zi', 'Stiinte Economice', '', '', '7.50', '6.75', '', '', '', '7.25', '6.90', '', '7.02', 'ADMIS'],
    ['3', 'GHI789', '3', '3', 'Liceul Tehnic', 'Nu', 'Zi', 'Electromecanica', '', '', '5.50', '4.75', '', '', '', '5.25', '4.90', '', '5.02', 'RESPINS']
  ];

  const mockSchools = ['Colegiul National', 'Liceul Economic', 'Liceul Tehnic'];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BacDataService', [
      'getAvailableCounties',
      'loadData',
      'getSchools'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        StatisticiBACComponent,
        HttpClientTestingModule,
        FiltersComponent,
        ChartComponent,
        SummaryComponent
      ],
      providers: [
        { provide: BacDataService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticiBACComponent);
    component = fixture.componentInstance;
    mockBacDataService = TestBed.inject(BacDataService) as jasmine.SpyObj<BacDataService>;

    // Setup default mock returns
    mockBacDataService.getAvailableCounties.and.returnValue(Promise.resolve(mockCounties));
    mockBacDataService.loadData.and.returnValue(Promise.resolve(mockRawData));
    mockBacDataService.getSchools.and.returnValue(mockSchools);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize counties on ngOnInit', async () => {
    await component.ngOnInit();

    expect(mockBacDataService.getAvailableCounties).toHaveBeenCalled();
    expect(component.counties).toEqual(mockCounties);
  });

  it('should load and process data when county is changed', async () => {
    component.counties = mockCounties;
    
    await component.onCountyChanged('AB');

    expect(mockBacDataService.loadData).toHaveBeenCalledWith('AB');
    expect(component.currentCounty).toBe('AB');
    expect(component.currentCountyName).toBe('Alba');
    expect(component.rawData).toEqual(mockRawData);
    expect(component.schools).toEqual(mockSchools);
    expect(component.isLoading).toBeFalse();
  });

  it('should clear data when empty county is selected', async () => {
    component.rawData = mockRawData;
    component.schools = mockSchools;

    await component.onCountyChanged('');

    expect(component.rawData).toEqual([]);
    expect(component.schools).toEqual([]);
    expect(component.currentCountyName).toBe('');
  });

  it('should filter data correctly', () => {
    component.rawData = mockRawData;
    
    component.onFiltersChanged({ school: 'Colegiul National', specialisation: 'Toate' });

    expect(component.filtered.length).toBe(1);
    expect(component.filtered[0][4]).toBe('Colegiul National');
    
    component.onFiltersChanged({ school: 'Toate', specialisation: 'Toate' });
    expect(component.filtered).toEqual(mockRawData);
  });

  it('should update chart data and calculate averages', () => {
    component.filtered = [
      ['1', 'ABC123', '1', '1', 'Test School', 'Nu', 'Zi', 'Test Spec', '', '', '9.50', '8.75', '', '', '', '9.25', '8.90', '', '9.02', 'PROMOVAT'],
      ['2', 'DEF456', '2', '2', 'Test School', 'Nu', 'Zi', 'Test Spec', '', '', '7.50', '6.75', '', '', '', '7.25', '6.90', '', '7.02', 'PROMOVAT'],
      ['3', 'GHI789', '3', '3', 'Test School', 'Nu', 'Zi', 'Test Spec', '', '', '5.50', '4.75', '', '', '', '5.25', '4.90', '', '5.02', 'RESPINS'],
      ['4', 'JKL012', '4', '4', 'Test School', 'Nu', 'Zi', 'Test Spec', '', '', '', '', '', '', '', '', '', '', '', 'NEPREZENTAT']
    ];

    component.updateChart();

    expect(component.chartData).toEqual([1, 1, 0, 1, 0, 1]);
    expect(component.mediaGenerala).toBeCloseTo(8.02, 2);
  });

  it('should handle loading states correctly', async () => {
    component.counties = mockCounties;
    const loadDataSpy = mockBacDataService.loadData.and.returnValue(
      new Promise(resolve => setTimeout(() => resolve(mockRawData), 100))
    );

    const promise = component.onCountyChanged('AB');
    
    expect(component.isLoading).toBeTrue();
    
    await promise;
    
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors gracefully', async () => {
    component.counties = mockCounties;
    mockBacDataService.loadData.and.returnValue(Promise.reject(new Error('Load failed')));
    spyOn(console, 'error');

    try {
      await component.onCountyChanged('AB');
    } catch (error) {
      // Expected to fail
    }

    expect(component.isLoading).toBeFalse();
  });

  it('should provide navigation functionality', () => {
    spyOn(history, 'back');
    
    component.goBack();
    
    expect(history.back).toHaveBeenCalled();
  });

  it('should calculate chart bins for different grade ranges', () => {
    component.filtered = [
      ['1', 'A', '1', '1', 'School', 'Nu', 'Zi', 'Spec', '', '', '', '', '', '', '', '', '', '', '9.5', 'ADMIS'],
      ['2', 'B', '2', '2', 'School', 'Nu', 'Zi', 'Spec', '', '', '', '', '', '', '', '', '', '', '8.5', 'ADMIS'],
      ['3', 'C', '3', '3', 'School', 'Nu', 'Zi', 'Spec', '', '', '', '', '', '', '', '', '', '', '7.5', 'ADMIS'],
      ['4', 'D', '4', '4', 'School', 'Nu', 'Zi', 'Spec', '', '', '', '', '', '', '', '', '', '', '5.5', 'RESPINS'],
      ['5', 'E', '5', '5', 'School', 'Nu', 'Zi', 'Spec', '', '', '', '', '', '', '', '', '', '', '', 'NEPREZENTAT']
    ];

    component.updateChart();

    expect(component.chartData.length).toBe(6);
    expect(component.mediaGenerala).toBeGreaterThan(0);
  });
});
