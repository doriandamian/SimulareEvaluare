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

  constructor(private router: Router) { }

  goTo(route: string) {
    if (route === 'statisticien') {
      this.router.navigate(['/statisticien']);
    } else if (route === 'statistici') {
      this.router.navigate(['/statistici']);
    }
  }
}
