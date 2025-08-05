import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EvCacheService } from '../services/ev.cache.service';
import { BacCacheService } from '../services/bac.cache.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private router: Router) {}

  // ngOnInit() {
  //   this.evData.init().subscribe({
  //     next: () => {
  //       const data = this.evData.getCountyData('CJ');
  //       console.log('Cluj data:', data);
  //     },
  //     error: (err) => console.error('Failed to load data:', err),
  //   });
  //   this.bacData.init().subscribe((allCandidates) => {
  //     console.log('Loaded total:', allCandidates.length);
  //     const clujData = this.bacData.getCountyData('CJ');
  //     console.log('CLUJ:', clujData);
  //   });
  // }

  goTo(route: string) {
    if (route === 'statisticien') {
      this.router.navigate(['/statisticien']);
    } else if (route === 'statistici') {
      this.router.navigate(['/statistici']);
    }
  }
}
