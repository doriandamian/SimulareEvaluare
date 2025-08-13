import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistici-en',
  standalone: true,
  imports: [],
  templateUrl: './statistici-en.component.html',
  styleUrl: './statistici-en.component.scss',
})
export class StatisticiEnComponent {
  showFourthButton = true;

  constructor(private router: Router) { }

  goTo(route: string) {
    if (route === 'repartizare') {
      this.router.navigate(['/repartizare']);
    } else if (route === 'ultimul-admis') {
      this.router.navigate(['/ultimul-admis']);
    } else if (route === 'contestatii') {
      this.router.navigate(['/contestatii']);
    } else if (route === 'grad-ocupare') {
      this.router.navigate(['/grad-ocupare']);
    }
  }

  goBack() {
    history.back();
  }
}
