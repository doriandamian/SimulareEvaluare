import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistici-en',
  standalone: true,
  imports: [],
  templateUrl: './statistici-en.component.html',
  styleUrl: './statistici-en.component.scss'
})
export class StatisticiEnComponent {

  constructor(private router: Router) { }

  goTo(route: string) {
    if (route === 'repartizare') {
      this.router.navigate(['/repartizare']);
    } else if (route === 'contestatii') {
      this.router.navigate(['/contestatii']);
    }
  }

  goBack() {
    history.back();
  }
}
