import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective, FormsModule, CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() set data(value: number[]) {
    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        {
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
        },
      ],
    };
  }

  chartData: ChartData<'pie'> = {
    labels: [],
    datasets: [],
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
          color: '#333',
        },
      },
    },
  };

  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;
  translations = {
    ro: {
      title: 'Distribuție note',
    },
    en: {
      title: 'Grade distribution',
    }
  };

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.langSub = this.languageService.language$.subscribe(lang => this.language = lang);
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
}
