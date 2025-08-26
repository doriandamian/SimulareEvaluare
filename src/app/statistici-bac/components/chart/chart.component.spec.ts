import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { ChartComponent } from './chart.component';

// Register Chart.js components
Chart.register(...registerables);

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct chart configuration', () => {
    expect(component.chartLabels).toEqual(['Neprezentat', 'Respins', '6-7', '7-8', '8-9', '9-10']);
    expect(component.chartType).toBe('pie');
  });

  it('should have correct background colors', () => {
    const expectedColors = [
      '#ef4444',
      '#f97316', 
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#059669'
    ];
    
    expect(component.chartColors[0].backgroundColor).toEqual(expectedColors);
  });

  it('should update chartData when data input is set', () => {
    const testData = [10, 5, 15, 20, 25, 8];
    
    component.data = testData;
    
    expect(component.chartData.labels).toEqual(component.chartLabels);
    expect(component.chartData.datasets.length).toBe(1);
    expect(component.chartData.datasets[0].data).toEqual(testData);
  });

  it('should have responsive chart options', () => {
    expect(component.chartOptions?.responsive).toBeTrue();
    expect(component.chartOptions?.maintainAspectRatio).toBeFalse();
    expect(component.chartOptions?.plugins?.legend?.position).toBe('bottom');
  });

  it('should configure legend labels with proper styling', () => {
    const legendLabels = component.chartOptions?.plugins?.legend?.labels;
    
    expect(legendLabels?.padding).toBe(20);
    expect(legendLabels?.usePointStyle).toBeTrue();
    expect((legendLabels?.font as any)?.size).toBe(14);
  });

  it('should format tooltip labels correctly', () => {
    const tooltipCallback = component.chartOptions?.plugins?.tooltip?.callbacks?.label;
    
    if (tooltipCallback) {
      const mockContext = {
        label: 'Admis',
        parsed: 25,
        dataset: {
          data: [10, 5, 15, 20, 25, 8] // total = 83
        }
      };
      
      const result = (tooltipCallback as any).call({}, mockContext);
      
      expect(result).toBe('Admis: 25 elevi (30.1%)');
    }
  });

  it('should handle data changes and maintain configuration', () => {
    const initialData = [1, 2, 3, 4, 5, 6];
    const newData = [10, 20, 30, 40, 50, 60];
    
    component.data = initialData;
    expect(component.chartData.datasets[0].data).toEqual(initialData);
    
    component.data = newData;
    expect(component.chartData.datasets[0].data).toEqual(newData);
    expect(component.chartData.labels).toEqual(component.chartLabels); // Labels should stay the same
  });
});
