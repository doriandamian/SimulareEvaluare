import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvCandidate } from '../model/ev.candidate';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { EvUrls } from '../assets/ev.urls';

@Injectable({
  providedIn: 'root',
})
export class EvCacheService {
  private cache = new Map<string, EvCandidate[]>();

  constructor(private http: HttpClient) {}

  init(): Observable<EvCandidate[]> {
    const requests = Object.entries(EvUrls).map(([county, url]) =>
      this.http.get<EvCandidate[]>(url)
    );

    return forkJoin(requests).pipe(
      tap((results) => {
        Object.keys(EvUrls).forEach((county, index) => {
          this.cache.set(county, results[index]);
        });
      }),
      map((all) => all.flat())
    );
  }

  getCountyData(abbreviation: string): any | null {
    return this.cache.get(abbreviation) || null;
  }
}
