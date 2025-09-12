import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UltimulAdmisFilters {
  school: string;
  specialization: string;
  selectedCombinations: Array<{ school: string; specialization: string }>;
}

@Component({
  selector: 'app-ultimul-admis-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ultimul-admis-filters.component.html',
  styleUrl: './ultimul-admis-filters.component.scss',
})
export class UltimulAdmisFiltersComponent implements OnInit, OnDestroy {
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;
  translations = {
    ro: {
      school: 'Liceu',
      specialization: 'Specializare',
      allSchools: '-- Toate liceele --',
      allSpecs: '-- Toate specializările --',
      selectSpec: '-- Selectează specializarea --',
      add: 'Adaugă la grafic',
      reset: 'Resetează tot',
    },
    en: {
      school: 'School',
      specialization: 'Specialization',
      allSchools: '-- All schools --',
      allSpecs: '-- All specializations --',
      selectSpec: '-- Select specialization --',
      add: 'Add to chart',
      reset: 'Reset all',
    }
  };

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.langSub = this.languageService.language$.subscribe((lang: 'ro' | 'en') => this.language = lang);
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
  @Input() schools: string[] = [];
  @Input() specializations: string[] = [];
  @Input() selectedFilters: UltimulAdmisFilters = {
    school: '',
    specialization: '',
    selectedCombinations: [],
  };

  @Output() filtersChange = new EventEmitter<UltimulAdmisFilters>();

  onSchoolChange() {
    this.selectedFilters.specialization = '';
    this.filtersChange.emit(this.selectedFilters);
  }

  onSpecializationChange() {
    this.filtersChange.emit(this.selectedFilters);
  }

  addCombination() {
    if (this.selectedFilters.school && this.selectedFilters.specialization) {
      const combination = {
        school: this.selectedFilters.school,
        specialization: this.selectedFilters.specialization,
      };

      const exists = this.selectedFilters.selectedCombinations.some(
        (c) =>
          c.school === combination.school &&
          c.specialization === combination.specialization
      );

      if (!exists) {
        this.selectedFilters.selectedCombinations = [
          ...this.selectedFilters.selectedCombinations,
          combination,
        ];
        this.filtersChange.emit({ ...this.selectedFilters });
      }
    }
  }

  removeCombination(index: number) {
    this.selectedFilters.selectedCombinations =
      this.selectedFilters.selectedCombinations.filter((_, i) => i !== index);
    this.filtersChange.emit({ ...this.selectedFilters });
  }

  resetFilters() {
    this.selectedFilters = {
      school: '',
      specialization: '',
      selectedCombinations: [],
    };
    this.filtersChange.emit(this.selectedFilters);
  }
}
