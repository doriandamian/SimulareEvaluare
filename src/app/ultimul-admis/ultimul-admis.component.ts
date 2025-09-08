import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  EnDataService,
  SchoolSpecialization,
  YearlyAdmissionData,
} from './services/en-data.service';
import {
  UltimulAdmisFiltersComponent,
  UltimulAdmisFilters,
} from './ultimul-admis-filters/ultimul-admis-filters.component';
import { UltimulAdmisTableComponent } from './ultimul-admis-table/ultimul-admis-table.component';
import { UltimulAdmisChartComponent } from './ultimul-admis-chart/ultimul-admis-chart.component';

@Component({
  selector: 'app-ultimul-admis',
  standalone: true,
  imports: [
    CommonModule,
    UltimulAdmisFiltersComponent,
    UltimulAdmisTableComponent,
    UltimulAdmisChartComponent,
  ],
  templateUrl: './ultimul-admis.component.html',
  styleUrl: './ultimul-admis.component.scss',
})
export class UltimulAdmisComponent implements OnInit, OnDestroy {
  translations = {
    ro: {
      back: '← Inapoi',
      title: 'Ultimul Admis la Liceu',
      desc: 'Indexul ultimului candidat admis la fiecare specializare in parte',
    },
    en: {
      back: '← Back',
      title: 'Last Admitted to High School',
      desc: 'Index of the last admitted candidate for each specialization',
    }
  };
  language: 'ro' | 'en' = 'ro';
  private langSub?: Subscription;
  isLoading = false;
  allData: SchoolSpecialization[] = [];
  filteredData: SchoolSpecialization[] = [];
  availableSchools: string[] = [];
  availableSpecializations: string[] = [];

  currentFilters: UltimulAdmisFilters = {
    school: '',
    specialization: '',
    selectedCombinations: [],
  };

  constructor(private enDataService: EnDataService, private languageService: LanguageService) { }

  ngOnInit() {
    this.langSub = this.languageService.language$.subscribe(lang => this.language = lang);
    this.loadData();
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  async loadData() {
    this.isLoading = true;

    try {
      this.enDataService.clearCache();
      this.allData = await this.enDataService.processAdmissionData();
      this.updateAvailableOptions();
      this.applyFilters();
    } catch (error) {
      console.error('Error loading admission data:', error);
      this.allData = [];
      this.filteredData = [];
    } finally {
      this.isLoading = false;
    }
  }

  onFiltersChange(filters: UltimulAdmisFilters) {
    this.currentFilters = { ...filters };
    this.updateAvailableOptions();
    this.applyFilters();
  }

  private updateAvailableOptions() {
    this.availableSchools = this.enDataService.getUniqueSchools(this.allData);

    if (this.currentFilters.school) {
      this.availableSpecializations =
        this.enDataService.getSpecializationsForSchool(
          this.allData,
          this.currentFilters.school
        );
    } else {
      this.availableSpecializations = [];
    }
  }

  private applyFilters() {
    if (this.currentFilters.selectedCombinations.length > 0) {
      this.filteredData = this.allData.filter((item) =>
        this.currentFilters.selectedCombinations.some(
          (combo) =>
            combo.school === item.school &&
            combo.specialization === item.specialization
        )
      );
    } else if (
      this.currentFilters.school &&
      this.currentFilters.specialization
    ) {
      this.filteredData = this.enDataService.filterData(
        this.allData,
        this.currentFilters.school,
        this.currentFilters.specialization
      );
    } else {
      this.filteredData = [];
    }
  }

  goBack() {
    window.history.back();
  }
}
