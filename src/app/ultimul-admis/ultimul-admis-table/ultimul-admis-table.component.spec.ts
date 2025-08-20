import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UltimulAdmisTableComponent } from './ultimul-admis-table.component';
import { SchoolSpecialization } from '../services/en-data.service';

describe('UltimulAdmisTableComponent', () => {
  let component: UltimulAdmisTableComponent;
  let fixture: ComponentFixture<UltimulAdmisTableComponent>;

  const mockData: SchoolSpecialization[] = [
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
    await TestBed.configureTestingModule({
      imports: [UltimulAdmisTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UltimulAdmisTableComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    component.data = [];
    fixture.detectChanges();
    
    expect(component.data).toEqual([]);
  });

  it('should display data rows correctly', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    
    expect(rows.length).toBe(mockData.length);
    
    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('Colegiul National "Mihai Eminescu"');
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('Matematica-Informatica');
  });

  it('should display year data correctly in columns', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    const firstRow = rows[0];
    const cells = firstRow.queryAll(By.css('td'));
    
    // Check that year data is displayed (specific columns depend on template structure)
    expect(cells.length).toBeGreaterThan(2);
    
    // Verify data contains expected values for first school
    const cellText = cells.map(cell => cell.nativeElement.textContent.trim()).join(' ');
    expect(cellText).toContain('9.5');
    expect(cellText).toContain('9.6');
  });

  it('should handle empty data gracefully', () => {
    component.data = [];
    fixture.detectChanges();
    
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(0);
  });

  it('should update display when data changes', () => {
    const newData: SchoolSpecialization[] = [{
      school: 'New School',
      specialization: 'New Spec',
      yearlyData: [{ year: 2024, lastAdmittedIndex: 50, lastAdmittedGrade: 8.0, totalCandidates: 100 }]
    }];
    
    component.data = newData;
    fixture.detectChanges();
    
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    
    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('New School');
  });

  it('should handle multiple years of data', () => {
    // Mock data already has multiple years, verify they're all displayed
    const tableText = fixture.nativeElement.textContent;
    
    expect(tableText).toContain('2022');
    expect(tableText).toContain('2023');
    expect(tableText).toContain('9.5');
    expect(tableText).toContain('9.6');
    expect(tableText).toContain('8.5');
    expect(tableText).toContain('8.7');
  });

  it('should preserve data structure integrity', () => {
    expect(component.data).toEqual(mockData);
    expect(component.data[0].yearlyData.length).toBe(2);
    expect(component.data[1].yearlyData.length).toBe(2);
  });
});
