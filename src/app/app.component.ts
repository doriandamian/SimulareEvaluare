import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from './services/language.service';
import { Subscription } from 'rxjs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SimulareEvaluare';
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.langSub = this.languageService.language$.subscribe(lang => this.language = lang);
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
