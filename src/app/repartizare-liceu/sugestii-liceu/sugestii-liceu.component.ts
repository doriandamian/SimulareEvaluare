import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Candidate } from '../models/candidate.model';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sugestii-liceu',
  templateUrl: './sugestii-liceu.component.html',
  standalone: true,
  styleUrls: ['./sugestii-liceu.component.scss'],
  imports: [CommonModule],
})
export class SugestiiLiceuComponent implements OnInit, OnDestroy {
  @Input() candidati: Candidate[] = [];
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;
  translations = {
    ro: {
      title: 'Sugestii liceu',
      noSuggestions: 'Nu există sugestii pentru criteriile selectate.',
      madmLabel: 'Media de admitere',
    },
    en: {
      title: 'High School Suggestions',
      noSuggestions: 'No suggestions for the selected criteria.',
      madmLabel: 'Admission average',
    }
  };
  constructor(private languageService: LanguageService) {}
  ngOnInit() {
    this.langSub = this.languageService.language$.subscribe((lang: 'ro' | 'en') => this.language = lang);
  }
  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
}

