import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective, FormsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  @Input() set data(value: number[]) {
    this.chartData = {
      labels: this.chartLabels,
      datasets: [{
        data: value,
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#84cc16',
          '#22c55e',
          '#059669',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      }]
    };
  }

  chartData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };

  chartLabels = ['Neprezentat', 'Respins', '6-7', '7-8', '8-9', '9-10'];
  chartType: ChartType = 'pie';
  chartColors = [
    {
      backgroundColor: [
        '#ef4444',
        '#f97316',
        '#eab308',
        '#84cc16',
        '#22c55e',
        '#059669',
      ],
    },
  ];
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const data = context.dataset.data as number[];
            const total = data.reduce((a, b) => (a || 0) + (b || 0), 0);
            const value = context.parsed as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} elevi (${percentage}%)`;
          }
        }
      }
    }
  };
}
