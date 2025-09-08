import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { DataService } from '../repartizare-liceu/services/data.service';
import { Candidate } from '../repartizare-liceu/models/candidate.model';
import { SugestiiLiceuComponent } from './sugestii-liceu/sugestii-liceu.component';
import { StatisticsPanelComponent } from './statistics-panel/statistics-panel.component';
import { RepartizareFormComponent } from './repartizare-form/repartizare-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repartizare-liceu',
  templateUrl: './repartizare-liceu.component.html',
  styleUrls: ['./repartizare-liceu.component.scss'],
  imports: [
    SugestiiLiceuComponent,
    StatisticsPanelComponent,
    RepartizareFormComponent,
    CommonModule,
  ],
  standalone: true,
})
export class RepartizareLiceuComponent implements OnInit, OnDestroy {
  candidati: Candidate[] = [];
  sugestii: Candidate[] = [];
  statistici: any = {};
  selectedYear = 2024;
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;

  constructor(private dataService: DataService, private languageService: LanguageService) { }

  ngOnInit() {
    this.langSub = this.languageService.language$.subscribe(lang => this.language = lang);
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  onSearch(data: { year: number; madm: number; mabs?: number }) {
    this.selectedYear = data.year;
    this.dataService.getCandidates(data.year).subscribe((res) => {
      this.candidati = res;

      this.statistici = {
        total: res.length,
        madm: this.avg(res.map((c) => parseFloat(c.madm))),
        romana: this.avg(res.map((c) => parseFloat(c.nro))),
        mate: this.avg(res.map((c) => parseFloat(c.nmate))),
        absolvire: this.avg(res.map((c) => parseFloat(c.mabs))),
      };

      this.sugestii = res
        .filter((c) => parseFloat(c.madm) <= data.madm)
        .sort((a, b) => parseFloat(b.madm) - parseFloat(a.madm));
    });
  }

  avg(values: number[]): number {
    const valid = values.filter((v) => !isNaN(v));
    return +(valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2);
  }

  goBack() {
    history.back();
  }
}
