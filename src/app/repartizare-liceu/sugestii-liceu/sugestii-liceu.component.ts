import { Component, Input } from '@angular/core';
import { Candidate } from '../models/candidate.model';

@Component({
  selector: 'app-sugestii-liceu',
  templateUrl: './sugestii-liceu.component.html',
})
export class SugestiiLiceuComponent {
  @Input() candidati: Candidate[] = [];
}