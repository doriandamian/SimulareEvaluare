import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { UltimulAdmisFiltersComponent, UltimulAdmisFilters } from './ultimul-admis-filters.component';

describe('UltimulAdmisFiltersComponent', () => {
  let component: UltimulAdmisFiltersComponent;
  let fixture: ComponentFixture<UltimulAdmisFiltersComponent>;

  const mockSchools = ['Colegiul National', 'Liceul Economic', 'Liceul Tehnic'];
  const mockSpecializations = ['Matematica-Informatica', 'Stiinte Economice', 'Filologie'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimulAdmisFiltersComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UltimulAdmisFiltersComponent);
    component = fixture.componentInstance;
    
    component.schools = mockSchools;
    component.specializations = mockSpecializations;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedFilters.school).toBe('');
    expect(component.selectedFilters.specialization).toBe('');
    expect(component.selectedFilters.selectedCombinations).toEqual([]);
  });

  it('should emit filtersChange when school or specialization changes', () => {
    spyOn(component.filtersChange, 'emit');
    
    component.selectedFilters.school = 'Colegiul National';
    component.onSchoolChange();
    
    expect(component.filtersChange.emit).toHaveBeenCalledWith(component.selectedFilters);
    
    component.selectedFilters.specialization = 'Matematica-Informatica';
    component.onSpecializationChange();
    
    expect(component.filtersChange.emit).toHaveBeenCalledWith(component.selectedFilters);
  });

  it('should clear specialization when school changes', () => {
    component.selectedFilters.specialization = 'Matematica-Informatica';
    
    component.onSchoolChange();
    
    expect(component.selectedFilters.specialization).toBe('');
  });

  it('should add and remove combinations correctly', () => {
    component.selectedFilters.school = 'Colegiul National';
    component.selectedFilters.specialization = 'Matematica-Informatica';
    
    component.addCombination();
    
    expect(component.selectedFilters.selectedCombinations.length).toBe(1);
    expect(component.selectedFilters.selectedCombinations[0]).toEqual({
      school: 'Colegiul National',
      specialization: 'Matematica-Informatica'
    });
    
    component.removeCombination(0);
    
    expect(component.selectedFilters.selectedCombinations.length).toBe(0);
  });

  it('should not add duplicate combinations', () => {
    component.selectedFilters.school = 'Colegiul National';
    component.selectedFilters.specialization = 'Matematica-Informatica';
    
    component.addCombination();
    component.addCombination();
    
    expect(component.selectedFilters.selectedCombinations.length).toBe(1);
  });

  it('should not add combination when school or specialization is missing', () => {
    component.selectedFilters.school = '';
    component.selectedFilters.specialization = 'Matematica-Informatica';
    component.addCombination();
    
    expect(component.selectedFilters.selectedCombinations.length).toBe(0);
    
    component.selectedFilters.school = 'Colegiul National';
    component.selectedFilters.specialization = '';
    component.addCombination();
    
    expect(component.selectedFilters.selectedCombinations.length).toBe(0);
  });

  it('should reset all filters', () => {
    component.selectedFilters.school = 'Colegiul National';
    component.selectedFilters.specialization = 'Matematica-Informatica';
    component.selectedFilters.selectedCombinations = [
      { school: 'Colegiul National', specialization: 'Matematica-Informatica' }
    ];
    
    component.resetFilters();
    
    expect(component.selectedFilters.school).toBe('');
    expect(component.selectedFilters.specialization).toBe('');
    expect(component.selectedFilters.selectedCombinations).toEqual([]);
  });

  it('should handle UI interactions correctly', () => {
    spyOn(component, 'addCombination');
    spyOn(component, 'resetFilters');
    
    const addButton = fixture.debugElement.query(By.css('button[type="button"]:not(.btn-outline-secondary)'));
    const resetButton = fixture.debugElement.query(By.css('button.btn-outline-secondary'));
    
    if (addButton) {
      addButton.triggerEventHandler('click', null);
      expect(component.addCombination).toHaveBeenCalled();
    }
    
    if (resetButton) {
      resetButton.triggerEventHandler('click', null);
      expect(component.resetFilters).toHaveBeenCalled();
    }
  });
});
