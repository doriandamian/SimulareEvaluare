import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-statistici-en',
  standalone: true,
  imports: [],
  templateUrl: './statistici-en.component.html',
  styleUrl: './statistici-en.component.scss',
})
export class StatisticiEnComponent implements OnInit, OnDestroy {
  showFourthButton = true;
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;
  translations = {
    ro: {
      back: '← Inapoi',
      title: 'Statistici Evaluare Nationala',
      repartizare: 'Repartizare Licee',
      repartizareDesc: 'Simulează repartizarea elevilor în liceele din România.',
      ultimulAdmis: 'Ultimul Admis',
      ultimulAdmisDesc: 'Vezi indexul ultimului candidat admis la fiecare specializare.',
      contestatii: 'Analiza contestatii',
      contestatiiDesc: 'Istoricul contestatiilor la proba scrisa la limba si literatura romana',
      gradOcupare: 'Grad Ocupare',
      gradOcupareDesc: 'Afiseaza care specializari sunt ocupate si in ce proportie.'
    },
    en: {
      back: '← Back',
      title: 'National Assessment Statistics',
      repartizare: 'High School Placement',
      repartizareDesc: 'Simulate the placement of students in Romanian high schools.',
      ultimulAdmis: 'Last Admitted',
      ultimulAdmisDesc: 'See the index of the last admitted candidate for each specialization.',
  contestatii: 'Challenge Analysis',
  contestatiiDesc: 'History of challenges for the Romanian language written exam',
      gradOcupare: 'Occupancy Rate',
      gradOcupareDesc: 'See which specializations are occupied and to what extent.'
    }
  };

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
    if (route === 'repartizare') {
      this.router.navigate(['/repartizare']);
    } else if (route === 'ultimul-admis') {
      this.router.navigate(['/ultimul-admis']);
    } else if (route === 'contestatii') {
      this.router.navigate(['/contestatii']);
    } else if (route === 'grad-ocupare') {
      this.router.navigate(['/grad-ocupare']);
    }
  }
  goBack() {
    history.back();
  }
}
