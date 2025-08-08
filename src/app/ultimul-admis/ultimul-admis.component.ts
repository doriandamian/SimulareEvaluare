import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnDataService, SchoolSpecialization, YearlyAdmissionData } from './services/en-data.service';
import { UltimulAdmisFiltersComponent, UltimulAdmisFilters } from './ultimul-admis-filters/ultimul-admis-filters.component';
import { UltimulAdmisTableComponent } from './ultimul-admis-table/ultimul-admis-table.component';
import { UltimulAdmisChartComponent } from './ultimul-admis-chart/ultimul-admis-chart.component';

@Component({
  selector: 'app-ultimul-admis',
  standalone: true,
  imports: [
    CommonModule,
    UltimulAdmisFiltersComponent,
    UltimulAdmisTableComponent,
    UltimulAdmisChartComponent
  ],
  templateUrl: './ultimul-admis.component.html',
  styleUrl: './ultimul-admis.component.scss'
})
export class UltimulAdmisComponent implements OnInit {
  isLoading = false;
  allData: SchoolSpecialization[] = [];
  filteredData: SchoolSpecialization[] = [];
  availableSchools: string[] = [];
  availableSpecializations: string[] = [];

  currentFilters: UltimulAdmisFilters = {
    school: '',
    specialization: '',
    selectedCombinations: []
  };

  constructor(private enDataService: EnDataService) { }

  async ngOnInit() {
    await this.loadData();
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
      this.availableSpecializations = this.enDataService.getSpecializationsForSchool(
        this.allData,
        this.currentFilters.school
      );
    } else {
      this.availableSpecializations = [];
    }
  }

  private applyFilters() {
    if (this.currentFilters.selectedCombinations.length > 0) {
      this.filteredData = this.allData.filter(item =>
        this.currentFilters.selectedCombinations.some(combo =>
          combo.school === item.school && combo.specialization === item.specialization
        )
      );
    } else if (this.currentFilters.school && this.currentFilters.specialization) {
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
