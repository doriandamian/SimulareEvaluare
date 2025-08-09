import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SchoolSpecialization,
  YearlyAdmissionData,
} from '../services/en-data.service';

@Component({
  selector: 'app-ultimul-admis-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ultimul-admis-table.component.html',
  styleUrl: './ultimul-admis-table.component.scss',
})
export class UltimulAdmisTableComponent {
  @Input() data: SchoolSpecialization[] = [];
  @Input() loading: boolean = false;

  sortColumn: keyof SchoolSpecialization = 'school';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortData(column: keyof SchoolSpecialization) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.data.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (this.sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }

  getSortIcon(column: keyof SchoolSpecialization): string {
    if (this.sortColumn !== column) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  trackByFn(index: number, item: SchoolSpecialization): string {
    return `${item.school}-${item.specialization}`;
  }

  getYearData(
    item: SchoolSpecialization,
    year: number
  ): YearlyAdmissionData | null {
    return item.yearlyData.find((data) => data.year === year) || null;
  }
}
