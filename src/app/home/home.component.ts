import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router) {}

  goTo(route: string) {
    if (route === 'repartizare') {
      this.router.navigate(['/repartizare']);
    } else if (route === 'statistici') {
      this.router.navigate(['/statistici']);
    }
  }
}
