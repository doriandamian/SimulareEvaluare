import { Component } from '@angular/core';
import { DataService } from '../repartizare-liceu/services/data.service';
import { Candidate } from '../repartizare-liceu/models/candidate.model';

@Component({
  selector: 'app-repartizare-liceu',
  templateUrl: './repartizare-liceu.component.html',
})
export class RepartizareLiceuComponent {
  candidati: Candidate[] = [];
  sugestii: Candidate[] = [];
  statistici: any = {};
  selectedYear = 2024;

  constructor(private dataService: DataService) {}

  onSearch(data: { year: number; madm: number; mabs?: number }) {
    this.selectedYear = data.year;
    this.dataService.getCandidates(data.year).subscribe((res) => {
      this.candidati = res;

      this.statistici = {
        total: res.length,
        madm: this.avg(res.map(c => parseFloat(c.madm))),
        romana: this.avg(res.map(c => parseFloat(c.nro))),
        mate: this.avg(res.map(c => parseFloat(c.nmate))),
        absolvire: this.avg(res.map(c => parseFloat(c.mabs))),
      };

      this.sugestii = res.filter(c => parseFloat(c.madm) <= data.madm);
    });
  }

  avg(values: number[]): number {
    const valid = values.filter(v => !isNaN(v));
    return +(valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2);
  }
}