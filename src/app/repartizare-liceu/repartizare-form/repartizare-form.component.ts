import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-repartizare-form',
  templateUrl: './repartizare-form.component.html',
  imports: [FormsModule],
  styleUrls: ['./repartizare-form.component.scss'],
  standalone: true,
})
export class RepartizareFormComponent implements OnInit, OnDestroy {
  selectedYear = 2024;
  medieAdmitere = '';
  medieAbsolvire = '';
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;
  translations = {
    ro: {
      year: 'An',
      medieAdmitere: 'Media admitere',
      medieAbsolvire: 'Media absolvire',
      search: 'Caută',
      questionTitle: 'Ce licee ți se potrivesc?',
    },
    en: {
      year: 'Year',
      medieAdmitere: 'Admission average',
      medieAbsolvire: 'Graduation average',
      search: 'Search',
      questionTitle: 'Which high schools fit you?',
    }
  };
  @Output() search = new EventEmitter<{
    year: number;
    madm: number;
    mabs?: number;
  }>();
  constructor(private languageService: LanguageService) {}
  ngOnInit() {
    this.langSub = this.languageService.language$.subscribe((lang: 'ro' | 'en') => this.language = lang);
  }
  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
  onSubmit() {
    const madm = parseFloat(this.medieAdmitere);
    const mabs = parseFloat(this.medieAbsolvire);
    this.search.emit({
      year: this.selectedYear,
      madm,
      mabs: isNaN(mabs) ? undefined : mabs,
    });
  }
}
