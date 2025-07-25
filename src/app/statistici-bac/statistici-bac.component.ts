import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartComponent } from './components/chart/chart.component';
import { FiltersComponent } from './components/filters/filters.component';
import { SummaryComponent } from './components/summary/summary.component';
import { BacDataService } from './services/bac-data.service';

@Component({
  selector: 'app-statistici-bac',
  standalone: true,
  imports: [CommonModule, FiltersComponent, ChartComponent, SummaryComponent],
  templateUrl: './statistici-bac.component.html',
  styleUrl: './statistici-bac.component.scss',
})
export class StatisticiBACComponent {
  rawData: any[][] = [];
  filtered: any[][] = [];

  chartData: number[] = [];
  mediaGenerala = 0;

  unitati: string[] = [];

  constructor(private dataService: BacDataService) {}

  async ngOnInit() {
    this.rawData = await this.dataService.loadData();

    this.unitati = this.dataService.getUnitati(this.rawData);

    this.onFiltersChanged({ unitate: 'Toate', specializare: 'Toate' });
  }

  onFiltersChanged(filters: { unitate: string; specializare: string }) {
    this.filtered = this.rawData.filter(
      (row) =>
        (filters.unitate === 'Toate' || row[2] === filters.unitate) &&
        (filters.specializare === 'Toate' || row[5] === filters.specializare)
    );
    this.updateChart();
  }

  updateChart() {
    const bins = [0, 0, 0, 0, 0, 0];
    let sum = 0;
    let count = 0;

    for (const row of this.filtered) {
      const rezultat = row[17];
      const medie = parseFloat(row[16].replace(',', '.'));

      if (rezultat === 'Neprezentat') bins[0]++;
      else if (rezultat === 'Respins') bins[1]++;
      else if (medie < 7) {
        bins[2]++;
        sum += medie;
        count++;
      } else if (medie < 8) {
        bins[3]++;
        sum += medie;
        count++;
      } else if (medie < 9) {
        bins[4]++;
        sum += medie;
        count++;
      } else {
        bins[5]++;
        sum += medie;
        count++;
      }
    }

    this.chartData = bins;
    this.mediaGenerala = count > 0 ? sum / count : 0;
  }

  goBack() {
    history.back();
  }
}
