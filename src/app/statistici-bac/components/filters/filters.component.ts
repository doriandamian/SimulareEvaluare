import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  @Input() schools: string[] = [];
  @Input() rawData: any[][] = [];

  @Output() selectionChanged = new EventEmitter<{
    school: string;
    specialisation: string;
  }>();

  selectedSchool = 'Toate';
  selectedSpecialisation = 'Toate';

  get filteredSpecialisations(): string[] {
    if (this.selectedSchool === 'Toate') {
      return Array.from(new Set(this.rawData.map(row => row[5])));
    } else {
      const specializari = this.rawData
        .filter(row => row[2] === this.selectedSchool)
        .map(row => row[5]);
      return Array.from(new Set(specializari));
    }
  }

  onUnitateChange() {
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
