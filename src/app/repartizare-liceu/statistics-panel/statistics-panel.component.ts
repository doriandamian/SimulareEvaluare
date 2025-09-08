import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-statistics-panel',
  templateUrl: './statistics-panel.component.html',
  standalone: true,
  styleUrls: ['./statistics-panel.component.scss'],
  imports: [CommonModule],
})
export class StatisticsPanelComponent implements OnInit, OnDestroy {
  @Input() year: number = 0;
  @Input() statistici: any;
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;
  translations = {
    ro: {
      title: 'Statistici',
      year: 'An',
      total: 'Total',
      madm: 'Media admitere',
      romana: 'Română',
      mate: 'Matematică',
      absolvire: 'Media absolvire',
    },
    en: {
      title: 'Statistics',
      year: 'Year',
      total: 'Total',
      madm: 'Admission average',
      romana: 'Romanian',
      mate: 'Mathematics',
      absolvire: 'Graduation average',
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
