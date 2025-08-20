import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { GradOcupareComponent } from './grad-ocupare.component';

describe('GradOcupareComponent', () => {
  let component: GradOcupareComponent;
  let fixture: ComponentFixture<GradOcupareComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCandidateData: any[] = [
    {
      ja: '2024',
      n: 'Test Name 1',
      jp: 'Test',
      s: 'M',
      sc: 'Some school',
      madm: '9.50',
      mev: '8.50',
      mabs: '7.50',
      nro: '10',
      nmate: '9',
      lm: 'RO',
      nlm: '8.5',
      h: '<b>CNME</b>',
      sp: '<b>Matematica-Informatica</b>',
      l: '<b>Filologie</b><br>Limba română'
    },
    {
      ja: '2024',
      n: 'Test Name 2',
      jp: 'Test',
      s: 'F',
      sc: 'Some school',
      madm: '8.75',
      mev: '8.00',
      mabs: '7.00',
      nro: '9',
      nmate: '8',
      lm: 'RO',
      nlm: '8.0',
      h: '<b>CNME</b>',
      sp: '<b>Matematica-Informatica</b>',
      l: '<b>Filologie</b><br>Limba română'
    },
    {
      ja: '2024',
      n: 'Test Name 3',
      jp: 'Test',
      s: 'M',
      sc: 'Some school',
      madm: '7.50',
      mev: '7.50',
      mabs: '6.50',
      nro: '8',
      nmate: '7',
      lm: 'RO',
      nlm: '7.5',
      h: '<b>Other School</b>',
      sp: '<b>Science</b>',
      l: '<b>Filologie</b><br>Limba română'
    },
    {
      ja: '2024',
      n: 'Test Name 4',
      jp: 'Test',
      s: 'F',
      sc: 'Nerepartizat',
      madm: null,
      mev: null,
      mabs: null,
      nro: null,
      nmate: null,
      lm: null,
      nlm: null,
      h: '<b>School Name</b>',
      sp: '<b>Specialization</b>',
      l: '<b>Filologie</b><br>Limba română'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [GradOcupareComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GradOcupareComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.userPosition).toBeNull();
    expect(component.userGrade).toBeNull();
    expect(component.allCandidates).toEqual([]);
    expect(component.analyzed).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('should load candidate data on initialization', () => {
    component.ngOnInit();

    const req = httpMock.expectOne('/assets/en/en2024.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCandidateData);

    expect(component.allCandidates.length).toBe(3); // Valid candidates only
    expect(component.isLoading).toBeFalse();
  });

  it('should handle HTTP error when loading data', () => {
    spyOn(console, 'error');
    component.ngOnInit();

    const req = httpMock.expectOne('/assets/en/en2024.json');
    req.error(new ErrorEvent('Network error'));

    expect(component.isLoading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should process school specializations correctly', () => {
    component.allCandidates = component.processRawCandidates(mockCandidateData);
    component.processSchoolSpecializations();

    expect(component.schoolSpecializations.length).toBeGreaterThan(0);
    expect(component.schoolSpecializations[0].school).toBeDefined();
    expect(component.schoolSpecializations[0].specialization).toBeDefined();
    expect(component.schoolSpecializations[0].totalSlots).toBeGreaterThan(0);
  });

  it('should analyze occupancy correctly', () => {
    component.userPosition = 50;
    component.allCandidates = component.processRawCandidates(mockCandidateData);
    component.processSchoolSpecializations();
    component.analyzeOccupancy();

    expect(component.analyzed).toBeTrue();
    expect(component.userGrade).toBeDefined();
    expect(component.completOcupate.length + component.partialOcupate.length + component.neocupate.length).toBeGreaterThan(0);
  });

  it('should categorize specializations by occupancy status', () => {
    component.userPosition = 100;
    component.allCandidates = component.processRawCandidates(mockCandidateData);
    component.processSchoolSpecializations();
    component.analyzeOccupancy(); // This calls categorizeSpecializations internally

    component.schoolSpecializations.forEach(spec => {
      expect(['complet', 'partial', 'neocupat']).toContain(spec.occupancyStatus);
      expect(spec.occupancyRate).toBeGreaterThanOrEqual(0);
      expect(spec.occupancyRate).toBeLessThanOrEqual(100);
    });
  });

  it('should not analyze without user position', () => {
    component.userPosition = null;
    component.analyzeOccupancy();
    expect(component.analyzed).toBeFalse();
  });

  it('should navigate back when goBack is called', () => {
    spyOn(window.history, 'back');
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });

  // Template Tests
  it('should display loading state', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeTruthy();
    
    // Handle HTTP request
    const req = httpMock.expectOne('/assets/en/en2024.json');
    req.flush(mockCandidateData);
  });

  it('should enable/disable analyze button based on state', () => {
    // Test disabled state
    component.userPosition = null;
    fixture.detectChanges();
    let req = httpMock.expectOne('/assets/en/en2024.json');
    req.flush(mockCandidateData);
    fixture.detectChanges();

    let buttonElement = fixture.debugElement.query(By.css('button:not(.back-button)'));
    expect(buttonElement.nativeElement.disabled).toBeTrue();

    // Test enabled state
    component.userPosition = 100;
    fixture.detectChanges();

    expect(buttonElement.nativeElement.disabled).toBeFalse();
  });

  it('should handle button clicks correctly', () => {
    spyOn(component, 'analyzeOccupancy');
    spyOn(component, 'goBack');
    
    component.userPosition = 100;
    fixture.detectChanges();
    
    const req = httpMock.expectOne('/assets/en/en2024.json');
    req.flush(mockCandidateData);
    fixture.detectChanges();

    // Test analyze button
    const analyzeButton = fixture.debugElement.query(By.css('button:not(.back-button)'));
    analyzeButton.nativeElement.click();
    expect(component.analyzeOccupancy).toHaveBeenCalled();

    // Test back button
    const backButton = fixture.debugElement.query(By.css('.back-button'));
    backButton.nativeElement.click();
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should update userPosition through input binding', async () => {
    fixture.detectChanges();
    
    const req = httpMock.expectOne('/assets/en/en2024.json');
    req.flush(mockCandidateData);
    
    const inputElement = fixture.debugElement.query(By.css('#userPosition'));
    inputElement.nativeElement.value = '123';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.userPosition).toBe(123);
  });
});
