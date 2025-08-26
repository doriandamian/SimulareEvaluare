import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chart, registerables } from 'chart.js';

import { UltimulAdmisChartComponent } from './ultimul-admis-chart.component';
import { SchoolSpecialization } from '../services/en-data.service';

// Register Chart.js components
Chart.register(...registerables);

describe('UltimulAdmisChartComponent', () => {
  let component: UltimulAdmisChartComponent;
  let fixture: ComponentFixture<UltimulAdmisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimulAdmisChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UltimulAdmisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default chart configuration', () => {
    expect(component.chartType).toBe('line');
    expect(component.chartData).toBeDefined();
    expect(component.chartOptions).toBeDefined();
  });

  it('should have responsive chart options', () => {
    expect(component.chartOptions?.responsive).toBeTrue();
    expect(component.chartOptions?.maintainAspectRatio).toBeFalse();
  });

  it('should have scales configured', () => {
    const scales = component.chartOptions?.scales;
    expect(scales).toBeDefined();
  });

  it('should initialize with empty chart data', () => {
    expect(component.chartData.datasets).toBeDefined();
    expect(component.chartData.labels).toBeDefined();
    expect(Array.isArray(component.chartData.datasets)).toBeTrue();
    expect(Array.isArray(component.chartData.labels)).toBeTrue();
  });

  it('should maintain chart type as line chart', () => {
    expect(component.chartType).toBe('line');
  });

  it('should have proper chart structure', () => {
    expect(component.chartData.datasets).toEqual([]);
    expect(component.chartData.labels).toEqual([]);
  });

  it('should be properly initialized', () => {
    expect(component).toBeTruthy();
    expect(component.chartData).toBeDefined();
    expect(component.chartOptions).toBeDefined();
    expect(component.chartType).toBe('line');
  });
});
