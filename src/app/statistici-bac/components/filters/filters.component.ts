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
  @Input() specializari: string[] = [];

  @Output() selectionChanged = new EventEmitter<{
    unitate: string;
    specializare: string;
  }>();

  selectedUnitate = 'Toate';
  selectedSpecializare = 'Toate';

  onChange() {
    this.selectionChanged.emit({
      unitate: this.selectedUnitate,
      specializare: this.selectedSpecializare,
    });
  }
}
