import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RepartizareFormComponent } from './repartizare-form/repartizare-form.component';
import { RepartizareLiceuComponent } from './repartizare-liceu.component';
import { SugestiiLiceuComponent } from './sugestii-liceu/sugestii-liceu.component'; 
import { StatisticsPanelComponent } from './statistics-panel/statistics-panel.component';
import { DataService } from './services/data.service'; 

@NgModule({
  declarations: [
    RepartizareFormComponent,
    RepartizareLiceuComponent,
    SugestiiLiceuComponent, 
    StatisticsPanelComponent,
  ],
  imports: [
    CommonModule, 
    FormsModule, 
  ],
  providers: [DataService], 
  exports: [
    RepartizareLiceuComponent 
  ]
})
export class RepartizareModule { }
