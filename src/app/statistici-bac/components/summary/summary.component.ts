import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent implements OnInit, OnDestroy {
  @Input() total = 0;
  @Input() media = 0;
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;
  translations = {
    ro: {
      total: 'Total candidați',
      media: 'Media generală',
    },
    en: {
      total: 'Total candidates',
      media: 'General average',
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

