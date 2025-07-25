import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Candidate } from '../models/candidate.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getCandidates(year: number): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`../assets/en/en${year}.json`);
  }
}