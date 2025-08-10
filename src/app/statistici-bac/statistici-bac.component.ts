import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartComponent } from './components/chart/chart.component';
import { FiltersComponent } from './components/filters/filters.component';
import { SummaryComponent } from './components/summary/summary.component';
import { BacDataService, CountyOption } from './services/bac-data.service';

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

  counties: CountyOption[] = [];
  schools: string[] = [];
  currentCounty = '';
  currentCountyName = '';
  isLoading = false;

  constructor(private dataService: BacDataService) {}

  async ngOnInit() {
    this.counties = await this.dataService.getAvailableCounties();
  }

  async onCountyChanged(county: string) {
    this.currentCounty = county;
    // Find the county name for display
    const countyOption = this.counties.find((c) => c.code === county);
    this.currentCountyName = countyOption ? countyOption.name : '';

    if (county) {
      this.isLoading = true;
      try {
        this.rawData = await this.dataService.loadData(county);
        this.schools = this.dataService.getSchools(this.rawData);
        this.onFiltersChanged({ school: 'Toate', specialisation: 'Toate' });
      } finally {
        this.isLoading = false;
      }
    } else {
      this.rawData = [];
      this.schools = [];
      this.filtered = [];
      this.chartData = [];
      this.currentCountyName = '';
      this.isLoading = false;
    }
  }

  onFiltersChanged(filters: { school: string; specialisation: string }) {
    this.filtered = this.rawData.filter(
      (row) =>
        (filters.school === 'Toate' || row[4] === filters.school) && // School name is at index 4
        (filters.specialisation === 'Toate' ||
          row[7] === filters.specialisation) // Specialization is at index 7
    );
    this.updateChart();
  }

  updateChart() {
    const bins = [0, 0, 0, 0, 0, 0];
    let sum = 0;
    let count = 0;

    for (const row of this.filtered) {
      const rezultat = row[19]; // Final result is at index 19
      const medieStr = row[18]; // Final average is at index 18

      // Skip if no average data
      if (!medieStr || medieStr === '') {
        if (rezultat === 'NEPREZENTAT') bins[0]++;
        else bins[1]++; // Consider as failed if no grade
        continue;
      }

      const medie = parseFloat(medieStr.toString().replace(',', '.'));

      if (rezultat === 'NEPREZENTAT') bins[0]++;
      else if (rezultat === 'RESPINS') bins[1]++;
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
