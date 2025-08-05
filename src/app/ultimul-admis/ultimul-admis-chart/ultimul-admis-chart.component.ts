import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { SchoolSpecialization } from '../services/en-data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-ultimul-admis-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './ultimul-admis-chart.component.html',
  styleUrl: './ultimul-admis-chart.component.scss'
})
export class UltimulAdmisChartComponent implements OnChanges {
  @Input() allData: SchoolSpecialization[] = [];
  @Input() selectedCombinations: Array<{school: string, specialization: string}> = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private cdr: ChangeDetectorRef) {}

  public chartType: ChartType = 'line';
  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };
  
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Evolutia Indexului Ultimului Admis',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'An'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Index Ultimul Admis'
        },
        beginAtZero: true,
        min: 0
      }
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    this.updateChart();
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.chart?.update();
    }, 100);
  }

  private updateChart() {
    if (!this.allData.length || !this.selectedCombinations.length) {
      this.chartData = {
        labels: [],
        datasets: []
      };
      return;
    }

    const allYears = new Set<number>();
    this.selectedCombinations.forEach(combination => {
      const data = this.allData.find(item => 
        item.school === combination.school && item.specialization === combination.specialization
      );
      if (data) {
        data.yearlyData.forEach(year => allYears.add(year.year));
      }
    });

    const sortedYears = Array.from(allYears).sort();
    
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];

    const datasets: any[] = [];
    let maxIndex = 0;

    this.selectedCombinations.forEach((combination, index) => {
      const data = this.allData.find(item => 
        item.school === combination.school && item.specialization === combination.specialization
      );
      
      if (data) {
        const color = colors[index % colors.length];
        
        const chartData = sortedYears.map(year => {
          const yearData = data.yearlyData.find(y => y.year === year);
          const indexValue = yearData ? yearData.lastAdmittedIndex : null;
          if (indexValue && indexValue > maxIndex) {
            maxIndex = indexValue;
          }
          return indexValue;
        });

        datasets.push({
          label: `${combination.school} - ${combination.specialization}`,
          data: chartData,
          borderColor: color,
          backgroundColor: color + '20',
          fill: false,
          tension: 0.4,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          spanGaps: false
        });
      }
    });

    this.chartData = {
      labels: sortedYears.map(year => year.toString()),
      datasets
    };

    if (this.chartOptions?.scales?.['y']) {
      (this.chartOptions.scales['y'] as any).max = Math.ceil(maxIndex * 1.1);
    }
  }

  get hasData(): boolean {
    return this.allData.length > 0 && this.selectedCombinations.length > 0;
  }

  get chartTitle(): string {
    if (this.selectedCombinations.length > 0) {
      if (this.selectedCombinations.length === 1) {
        const combo = this.selectedCombinations[0];
        return `${combo.school} - ${combo.specialization}`;
      } else {
        return `Comparatie ${this.selectedCombinations.length} specializari`;
      }
    }
    return 'Selecteaza specializarea pentru a vedea graficul';
  }
}
