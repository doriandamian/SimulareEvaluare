import { Component, OnInit } from '@angular/core';
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
  Legend
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
  imports: [CommonModule],
})
export class IstoricContestatiiComponent implements OnInit {
  statisticiHtml = '';
  private filterInterval = false;

  ngOnInit(): void {
    fetch('../assets/en/candidate2025.json')
      .then(res => res.json())
      .then((data: Note[]) => {
        let contested = data.filter(e => e.ra !== null);

        if (this.filterInterval) {
          contested = contested.filter(e => e.ri >= 8 && e.ri <= 9);
        }

        contested.sort((a, b) => a.ri - b.ri);

        const labels = contested.map(e => e.name);
        const riValues = contested.map(e => e.ri);
        const raValues = contested.map(e => e.ra as number);
        const deviation = contested.map(e => (e.ra as number) - e.ri);

        const total = contested.length;
        const crescut = contested.filter(e => (e.ra as number) > e.ri).length;
        const scazut = contested.filter(e => (e.ra as number) < e.ri).length;
        const neschimbat = contested.filter(e => (e.ra as number) === e.ri).length;
        const mediaDiferenta = total > 0
          ? (contested.reduce((acc, e) => acc + ((e.ra as number) - e.ri), 0) / total).toFixed(3)
          : '0';

        this.statisticiHtml = `
          <p>Total contestații${this.filterInterval ? " (8 ≤ nota inițială ≤ 9)" : ""}: <strong>${total}</strong></p>
          <p>Note crescute: <strong>${crescut}</strong></p>
          <p>Note scazute: <strong>${scazut}</strong></p>
          <p>Fara modificare: <strong>${neschimbat}</strong></p>
          <p>Diferenta medie: <strong>${mediaDiferenta}</strong> puncte</p>
        `;

        this.renderCharts(labels, riValues, raValues, deviation);
      })
      .catch(error => {
        this.statisticiHtml = `<p style="color: red;">Eroare la încărcarea candidate2025.json: ${error}</p>`;
      });
  }

  private renderCharts(labels: string[], riValues: number[], raValues: number[], deviation: number[]): void {
    new Chart('chartNote', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Nota initiala (ri)',
            data: riValues,
            borderColor: 'blue',
            fill: false,
            tension: 0.1
          },
          {
            label: 'Nota după contestatie (ra)',
            data: raValues,
            borderColor: 'green',
            fill: false,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Evolutia notelor la romana (ri vs ra)' },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const idx = ctx.dataIndex;
                return [
                  `Nota initiala: ${riValues[idx].toFixed(2)}`,
                  `Nota dupa contestatie: ${raValues[idx].toFixed(2)}`
                ];
              }
            }
          }
        }
      }
    });

    new Chart('chartDeviatie', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Diferenta (ra - ri)',
          data: deviation,
          backgroundColor: deviation.map(v => v >= 0 ? 'green' : 'red')
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Devierea fata de nota initiala (ra - ri)' },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const idx = ctx.dataIndex;
                return [
                  `Diferenta: ${deviation[idx].toFixed(2)}`,
                  `Initial: ${riValues[idx].toFixed(2)}`,
                  `Contestata: ${raValues[idx].toFixed(2)}`
                ];
              }
            }
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}


