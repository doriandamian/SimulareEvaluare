import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-repartizare-form',
  templateUrl: './repartizare-form.component.html',
  imports: [FormsModule],
  styleUrls: ['./repartizare-form.component.scss'],
  standalone: true,
})
export class RepartizareFormComponent {
  selectedYear = 2024; 
  medieAdmitere = ''; 
  medieAbsolvire = ''; 

  @Output() search = new EventEmitter<{ year: number; madm: number; mabs?: number }>();

  onSubmit() {
    const madm = parseFloat(this.medieAdmitere); 
    const mabs = parseFloat(this.medieAbsolvire); 
    this.search.emit({
      year: this.selectedYear,
      madm,
      mabs: isNaN(mabs) ? undefined : mabs, 
    });
  }
}
