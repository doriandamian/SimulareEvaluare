import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistics-panel',
  templateUrl: './statistics-panel.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class StatisticsPanelComponent {
  @Input() year: number = 0;
  @Input() statistici: any;
}