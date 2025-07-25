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
  @Input() unitati: string[] = [];
  @Input() rawData: any[][] = [];

  @Output() selectionChanged = new EventEmitter<{
    unitate: string;
    specializare: string;
  }>();

  selectedUnitate = 'Toate';
  selectedSpecializare = 'Toate';

  get filteredSpecializari(): string[] {
    if (this.selectedUnitate === 'Toate') {
      return Array.from(new Set(this.rawData.map(row => row[5])));
    } else {
      const specializari = this.rawData
        .filter(row => row[2] === this.selectedUnitate)
        .map(row => row[5]);
      return Array.from(new Set(specializari));
    }
  }

  onUnitateChange() {
    this.selectedSpecializare = 'Toate';
    this.onChange();
  }

  onChange() {
    this.selectionChanged.emit({
      unitate: this.selectedUnitate,
      specializare: this.selectedSpecializare,
    });
  }
}
