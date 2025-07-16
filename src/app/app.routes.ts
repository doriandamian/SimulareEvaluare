import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RepartizareLiceuComponent } from './repartizare-liceu/repartizare-liceu.component';
import { StatisticiBACComponent } from './statistici-bac/statistici-bac.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'repartizare', component: RepartizareLiceuComponent },
  { path: 'statistici', component: StatisticiBACComponent },
];