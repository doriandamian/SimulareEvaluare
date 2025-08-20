import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FiltersComponent } from './filters.component';
import { CountyOption } from '../../services/bac-data.service';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  const mockCounties: CountyOption[] = [
    { code: 'AB', name: 'Alba' },
    { code: 'AR', name: 'Arad' },
    { code: 'B', name: 'Bucuresti' }
  ];

  const mockSchools = ['Colegiul National', 'Liceul Economic', 'Liceul Tehnic'];

  const mockRawData = [
    ['1', 'ABC123', '1', '1', 'Colegiul National', 'Nu', 'Zi', 'Matematica-Informatica', '', '', '9.50', '8.75', '', '', '', '9.25', '8.90', '', '9.02', 'ADMIS'],
    ['2', 'DEF456', '2', '2', 'Colegiul National', 'Nu', 'Zi', 'Stiinte Sociale', '', '', '7.50', '6.75', '', '', '', '7.25', '6.90', '', '7.02', 'ADMIS'],
    ['3', 'GHI789', '3', '3', 'Liceul Economic', 'Nu', 'Zi', 'Stiinte Economice', '', '', '5.50', '4.75', '', '', '', '5.25', '4.90', '', '5.02', 'RESPINS'],
    ['4', 'JKL012', '4', '4', 'Liceul Tehnic', 'Nu', 'Zi', 'Electromecanica', '', '', '6.50', '5.75', '', '', '', '6.25', '5.90', '', '6.02', 'ADMIS']
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    
    // Set up default inputs
    component.counties = mockCounties;
    component.schools = mockSchools;
    component.rawData = mockRawData;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedCounty).toBe('');
    expect(component.selectedSchool).toBe('Toate');
    expect(component.selectedSpecialisation).toBe('Toate');
  });

  it('should display counties and schools in dropdowns', () => {
    const countySelect = fixture.debugElement.query(By.css('.county-select'));
    const schoolSelect = fixture.debugElement.query(By.css('.unitate-select'));
    const countyOptions = countySelect.queryAll(By.css('option'));
    const schoolOptions = schoolSelect.queryAll(By.css('option'));
    
    expect(countyOptions.length).toBe(4); // 3 counties + 1 default
    expect(schoolOptions.length).toBe(4); // 3 schools + 1 "Toate"
    expect(countyOptions[1].nativeElement.textContent.trim()).toBe('Alba');
    expect(schoolOptions[0].nativeElement.textContent.trim()).toBe('Toate');
  });

  it('should emit countyChanged and reset filters on county change', () => {
    spyOn(component.countyChanged, 'emit');
    
    component.selectedCounty = 'AB';
    component.onCountyChange();
    
    expect(component.countyChanged.emit).toHaveBeenCalledWith('AB');
    expect(component.selectedSchool).toBe('Toate');
    expect(component.selectedSpecialisation).toBe('Toate');
  });

  it('should emit selectionChanged on filter changes', () => {
    spyOn(component.selectionChanged, 'emit');
    
    component.selectedSchool = 'Colegiul National';
    component.onChange();
    
    expect(component.selectionChanged.emit).toHaveBeenCalledWith({
      school: 'Colegiul National',
      specialisation: 'Toate'
    });
  });

  it('should return all specialisations when "Toate" school is selected', () => {
    component.selectedSchool = 'Toate';
    const specialisations = component.filteredSpecialisations;
    
    expect(specialisations).toContain('Matematica-Informatica');
    expect(specialisations).toContain('Stiinte Sociale');
    expect(specialisations).toContain('Stiinte Economice');
    expect(specialisations).toContain('Electromecanica');
  });

  it('should return filtered specialisations for selected school', () => {
    component.selectedSchool = 'Colegiul National';
    const specialisations = component.filteredSpecialisations;
    
    expect(specialisations).toContain('Matematica-Informatica');
    expect(specialisations).toContain('Stiinte Sociale');
    expect(specialisations).not.toContain('Stiinte Economice');
    expect(specialisations).not.toContain('Electromecanica');
  });

  it('should return unique specialisations without duplicates', () => {
    const rawDataWithDuplicates = [
      ...mockRawData,
      ['5', 'MNO345', '5', '5', 'Colegiul National', 'Nu', 'Zi', 'Matematica-Informatica', '', '', '8.50', '7.75', '', '', '', '8.25', '7.90', '', '8.02', 'ADMIS']
    ];
    component.rawData = rawDataWithDuplicates;
    
    component.selectedSchool = 'Colegiul National';
    const specialisations = component.filteredSpecialisations;
    
    const mathInfoCount = specialisations.filter((s: string) => s === 'Matematica-Informatica').length;
    expect(mathInfoCount).toBe(1);
  });

  it('should handle empty data gracefully', () => {
    component.rawData = [];
    component.selectedSchool = 'Toate';
    
    const specialisations = component.filteredSpecialisations;
    
    expect(specialisations).toEqual([]);
  });

  it('should handle UI changes and events', async () => {
    spyOn(component.selectionChanged, 'emit');
    
    component.selectedCounty = 'AB';
    component.selectedSchool = 'Liceul Economic';
    fixture.detectChanges();
    await fixture.whenStable();
    
    const schoolSelect = fixture.debugElement.query(By.css('.unitate-select'));
    schoolSelect.triggerEventHandler('change', { target: { value: 'Liceul Economic' } });
    
    expect(component.selectedSchool).toBe('Liceul Economic');
  });
});
