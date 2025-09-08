import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private languageSubject = new BehaviorSubject<'ro' | 'en'>('ro');
  language$ = this.languageSubject.asObservable();

  setLanguage(lang: 'ro' | 'en') {
    this.languageSubject.next(lang);
  }

  getLanguage(): 'ro' | 'en' {
    return this.languageSubject.value;
  }

  toggleLanguage() {
    this.setLanguage(this.getLanguage() === 'ro' ? 'en' : 'ro');
  }
}
