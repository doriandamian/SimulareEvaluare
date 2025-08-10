import { Component, Input } from '@angular/core';
import { Candidate } from '../models/candidate.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sugestii-liceu',
  templateUrl: './sugestii-liceu.component.html',
  standalone: true,
  styleUrls: ['./sugestii-liceu.component.scss'],
  imports: [CommonModule],
})
export class SugestiiLiceuComponent {
  @Input() candidati: Candidate[] = [];
}
