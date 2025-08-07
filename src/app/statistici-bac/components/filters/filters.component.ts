import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountyOption } from '../../services/bac-data.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  @Input() counties: CountyOption[] = [];
  @Input() schools: string[] = [];
  @Input() rawData: any[][] = [];

  @Output() countyChanged = new EventEmitter<string>();
  @Output() selectionChanged = new EventEmitter<{
    school: string;
    specialisation: string;
  }>();

  selectedCounty = '';
  selectedSchool = 'Toate';
  selectedSpecialisation = 'Toate';

  get filteredSpecialisations(): string[] {
    if (this.selectedSchool === 'Toate') {
      return Array.from(new Set(this.rawData.map(row => row[7]))); // Specialization is at index 7
    } else {
      const specializari = this.rawData
        .filter(row => row[4] === this.selectedSchool) // School name is at index 4
        .map(row => row[7]);
      return Array.from(new Set(specializari));
    }
  }

  onCountyChange() {
    this.selectedSchool = 'Toate';
    this.selectedSpecialisation = 'Toate';
    this.countyChanged.emit(this.selectedCounty);
  }

  onSchoolChange() {
    this.selectedSpecialisation = 'Toate';
    this.onChange();
  }

  onChange() {
    this.selectionChanged.emit({
      school: this.selectedSchool,
      specialisation: this.selectedSpecialisation,
    });
  }
}
