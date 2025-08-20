import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.total).toBe(0);
    expect(component.media).toBe(0);
  });

  it('should accept and display input values', () => {
    component.total = 150;
    component.media = 7.85;
    fixture.detectChanges();
    
    expect(component.total).toBe(150);
    expect(component.media).toBe(7.85);
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('150');
    expect(compiled.textContent).toContain('7.85');
  });

  it('should handle zero values correctly', () => {
    component.total = 0;
    component.media = 0;
    fixture.detectChanges();
    
    expect(component.total).toBe(0);
    expect(component.media).toBe(0);
  });

  it('should handle decimal values for media', () => {
    component.media = 7.123456;
    fixture.detectChanges();
    
    expect(component.media).toBe(7.123456);
  });

  it('should handle large numbers', () => {
    component.total = 999999;
    component.media = 10.0;
    fixture.detectChanges();
    
    expect(component.total).toBe(999999);
    expect(component.media).toBe(10.0);
  });

  it('should update display when inputs change', () => {
    // Initial values
    component.total = 100;
    component.media = 5.0;
    fixture.detectChanges();
    
    let compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('100');
    expect(compiled.textContent).toContain('5');
    
    // Change values
    component.total = 200;
    component.media = 8.5;
    fixture.detectChanges();
    
    compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('200');
    expect(compiled.textContent).toContain('8.5');
  });

  it('should be a simple component with only input properties', () => {
    // This component should not have complex logic, just display inputs
    const initialTotal = component.total;
    const initialMedia = component.media;
    
    component.total = 300;
    component.media = 9.5;
    
    expect(component.total).toBe(300);
    expect(component.media).toBe(9.5);
    // No side effects should occur
  });

  it('should handle rapid input changes', () => {
    const values = [
      { total: 50, media: 6.5 },
      { total: 150, media: 7.5 },
      { total: 250, media: 8.5 }
    ];
    
    values.forEach(({ total, media }) => {
      component.total = total;
      component.media = media;
      fixture.detectChanges();
      
      expect(component.total).toBe(total);
      expect(component.media).toBe(media);
    });
  });

  it('should not modify input values', () => {
    const originalTotal = 123;
    const originalMedia = 6.78;
    
    component.total = originalTotal;
    component.media = originalMedia;
    fixture.detectChanges();
    
    // Values should remain exactly as set
    expect(component.total).toBe(originalTotal);
    expect(component.media).toBe(originalMedia);
  });
});
