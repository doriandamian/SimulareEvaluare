import { Component, NgModule, OnInit } from '@angular/core';
import { EvCacheService } from '../services/ev.cache.service';
import { EvCandidate } from '../model/ev.candidate';
import { COUNTY_NAMES } from '../assets/county-names';
import { FormsModule } from '@angular/forms';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface Note {
  name: string;
  ri: number;
  ra: number | null;
}

@Component({
  selector: 'app-romanian-contest-analysis',
  templateUrl: './istoric-contestatii.component.html',
  styleUrls: ['./istoric-contestatii.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})

export class IstoricContestatiiComponent implements OnInit {
  private chartNoteInstance: Chart | null = null;
  private chartDeviatieInstance: Chart | null = null;
  statisticiHtml = '';
  private filterInterval = false;
  counties = Object.keys(COUNTY_NAMES);
  countyNames = COUNTY_NAMES;
  selectedCounty = 'BV';
  allData: { [county: string]: EvCandidate[] } = {};
  contested: EvCandidate[] = [];
  selectedGraph: 'note' | 'deviatie' = 'note';
  onGraphSwitch() {
    // Wait for DOM to update, then render the selected chart for the current county
    setTimeout(() => {
      this.renderSelectedChart();
    });
  }

  private renderSelectedChart() {
    const data = this.allData[this.selectedCounty] || [];
    const safeContested: EvCandidate[] = data.filter(
      (e: EvCandidate) => e.ri !== null && e.ra !== null
    );
    const labels = safeContested.map((e: EvCandidate) => e.name);
    const riValues = safeContested.map((e: EvCandidate) => e.ri as number);
    const raValues = safeContested.map((e: EvCandidate) => e.ra as number);
    const deviation = safeContested.map(
      (e: EvCandidate) => (e.ra as number) - (e.ri as number)
    );
    if (this.selectedGraph === 'note') {
      this.renderChartNote(labels, riValues, raValues);
    } else {
      this.renderChartDeviatie(labels, riValues, raValues, deviation);
    }
  }

  constructor(private evCache: EvCacheService) { }

  ngOnInit(): void {
    this.evCache.init().subscribe(() => {
      this.counties.forEach((county) => {
        this.allData[county] = this.evCache.getCountyData(county) || [];
      });
      this.onCountyChange();
    });
  }

  onCountyChange() {
    const data = this.allData[this.selectedCounty] || [];
    const safeContested: EvCandidate[] = data.filter(
      (e: EvCandidate) => e.ri !== null && e.ra !== null
    );
    this.contested = safeContested;

    const labels = safeContested.map((e: EvCandidate) => e.name);
    const riValues = safeContested.map((e: EvCandidate) => e.ri as number);
    const raValues = safeContested.map((e: EvCandidate) => e.ra as number);
    const deviation = safeContested.map(
      (e: EvCandidate) => (e.ra as number) - (e.ri as number)
    );

    const total = safeContested.length;
    const crescut = safeContested.filter(
      (e: EvCandidate) => (e.ra as number) > (e.ri as number)
    ).length;
    const scazut = safeContested.filter(
      (e: EvCandidate) => (e.ra as number) < (e.ri as number)
    ).length;
    const neschimbat = safeContested.filter(
      (e: EvCandidate) => (e.ra as number) === (e.ri as number)
    ).length;
    const mediaDiferenta =
      total > 0
        ? (
          safeContested.reduce(
            (acc: number, e: EvCandidate) =>
              acc + ((e.ra as number) - (e.ri as number)),
            0
          ) / total
        ).toFixed(3)
        : '0';

    this.statisticiHtml = `
      <p>Total contestații${this.filterInterval ? ' (8 ≤ nota inițială ≤ 9)' : ''
      }: <strong>${total}</strong></p>
      <p>Note crescute: <strong>${crescut}</strong></p>
      <p>Note scazute: <strong>${scazut}</strong></p>
      <p>Fara modificare: <strong>${neschimbat}</strong></p>
      <p>Diferenta medie: <strong>${mediaDiferenta}</strong> puncte</p>
    `;

    this.renderSelectedChart();
  }

  private renderChartNote(labels: string[], riValues: number[], raValues: number[]) {
    if (this.chartNoteInstance) {
      this.chartNoteInstance.destroy();
      this.chartNoteInstance = null;
    }
    // Only render if the canvas is present
    const canvas = document.getElementById('chartNote') as HTMLCanvasElement;
    if (!canvas) return;
    this.chartNoteInstance = new Chart('chartNote', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Nota initiala (ri)',
            data: riValues,
            borderColor: 'blue',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Nota după contestatie (ra)',
            data: raValues,
            borderColor: 'green',
            fill: false,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Evolutia notelor la romana (ri vs ra)',
            font: { size: 22 },
          },
          legend: { labels: { font: { size: 18 } } },
          tooltip: {
            bodyFont: { size: 18 },
            titleFont: { size: 20 },
            callbacks: {
              label: (ctx) => {
                const idx = ctx.dataIndex;
                return [
                  `Nota initiala: ${riValues[idx].toFixed(2)}`,
                  `Nota dupa contestatie: ${raValues[idx].toFixed(2)}`,
                ];
              },
            },
          },
        },
        scales: {
          x: { ticks: { font: { size: 16 } } },
          y: { ticks: { font: { size: 16 } } },
        },
      },
    });
    // Destroy the other chart if it exists
    if (this.chartDeviatieInstance) {
      this.chartDeviatieInstance.destroy();
      this.chartDeviatieInstance = null;
    }
  }

  private renderChartDeviatie(labels: string[], riValues: number[], raValues: number[], deviation: number[]) {
    if (this.chartDeviatieInstance) {
      this.chartDeviatieInstance.destroy();
      this.chartDeviatieInstance = null;
    }
    // Only render if the canvas is present
    const canvas = document.getElementById('chartDeviatie') as HTMLCanvasElement;
    if (!canvas) return;
    this.chartDeviatieInstance = new Chart('chartDeviatie', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Diferenta (ra - ri)',
            data: deviation,
            backgroundColor: deviation.map((v) => (v >= 0 ? 'green' : 'red')),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Devierea fata de nota initiala (ra - ri)',
            font: { size: 22 },
          },
          legend: { labels: { font: { size: 18 } } },
          tooltip: {
            bodyFont: { size: 18 },
            titleFont: { size: 20 },
            callbacks: {
              label: (ctx) => {
                const idx = ctx.dataIndex;
                return [
                  `Diferenta: ${deviation[idx].toFixed(2)}`,
                  `Initial: ${riValues[idx].toFixed(2)}`,
                  `Contestata: ${raValues[idx].toFixed(2)}`,
                ];
              },
            },
          },
        },
        scales: {
          x: { ticks: { font: { size: 16 } } },
          y: { beginAtZero: true, ticks: { font: { size: 16 } } },
        },
      },
    });
    // Destroy the other chart if it exists
    if (this.chartNoteInstance) {
      this.chartNoteInstance.destroy();
      this.chartNoteInstance = null;
    }
  }

  goBack() {
    window.history.back();
  }
}
