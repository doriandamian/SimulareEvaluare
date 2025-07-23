import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistics-panel',
  templateUrl: './statistics-panel.component.html',
})
export class StatisticsPanelComponent {
  @Input() year: number = 0;
  @Input() statistici: any;
}