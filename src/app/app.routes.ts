import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RepartizareLiceuComponent } from './repartizare-liceu/repartizare-liceu.component';
import { StatisticiBACComponent } from './statistici-bac/statistici-bac.component';
import { StatisticiEnComponent } from './statistici-en/statistici-en.component';
import { UltimulAdmisComponent } from './ultimul-admis/ultimul-admis.component';
import { IstoricContestatiiComponent } from './istoric-contestatii/istoric-contestatii.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'repartizare', component: RepartizareLiceuComponent },
  { path: 'statistici-bac', component: StatisticiBACComponent },
  { path:'statisticien', component: StatisticiEnComponent},
  { path: 'ultimul-admis', component: UltimulAdmisComponent },
  { path:'contestatii', component: IstoricContestatiiComponent}
];