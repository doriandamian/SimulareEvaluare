import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  translations = {
    ro: {
      title: 'Simulare Repartizare Licee',
      statisticiEN: 'Statistici EN',
      statisticiENDesc: 'Exploreaza datele si graficele Evaluarii Nationale.',
      statisticiBac: 'Statistici Bac 2025',
      statisticiBacDesc: 'Exploreaza datele si graficele examenului de Bacalaureat 2025.'
    },
    en: {
      title: 'High School Placement Simulation',
      statisticiEN: 'EN Statistics',
      statisticiENDesc: 'Explore National Assessment data and charts.',
      statisticiBac: 'Baccalaureate 2025 Statistics',
      statisticiBacDesc: 'Explore Baccalaureate 2025 exam data and charts.',
      challenge: 'Challenge Analysis',
      challengeDesc: 'History of challenges for the Romanian language written exam.'
    }
  };
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;
  constructor(private router: Router, private languageService: LanguageService) { }

  ngOnInit() {
    this.langSub = this.languageService.language$.subscribe(lang => this.language = lang);
  }
  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
  goTo(route: string) {
    if (route === 'statisticien') {
      this.router.navigate(['/statisticien']);
    } else if (route === 'statistici') {
      this.router.navigate(['/statistici-bac']);
    }
  }
}
