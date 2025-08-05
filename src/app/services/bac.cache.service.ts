import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BacCandidate } from '../model/bac.candidate';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { BacUrls } from '../assets/bac.urls';

@Injectable({
  providedIn: 'root',
})
export class BacCacheService {
  private cache = new Map<string, BacCandidate[]>();

  constructor(private http: HttpClient) {}

  init(): Observable<BacCandidate[]> {
    const counties = Object.entries(BacUrls);

    const allCountyRequests = counties.map(([county, firstPageUrl]) =>
      this.loadAllCountyPages(county, firstPageUrl)
    );

    return forkJoin(allCountyRequests).pipe(
      tap((allResults) => {
        allResults.forEach((candidates, index) => {
          const county = counties[index][0];
          this.cache.set(county, candidates);
        });
      }),
      map((allResults) => allResults.flat())
    );
  }

  getCountyData(county: string): BacCandidate[] {
    return this.cache.get(county) || [];
  }

  private loadAllCountyPages(
    county: string,
    firstPageUrl: string
  ): Observable<BacCandidate[]> {
    const baseMatch = firstPageUrl.match(/(.*\/page_)\d+(\.html)/);
    if (!baseMatch)
      return this.http
        .get(firstPageUrl, { responseType: 'text' })
        .pipe(map((html) => this.parseHtmlToCandidates(html, county)));

    const [_, base, ext] = baseMatch;

    const loadPage = (
      pageIndex: number,
      accumulated: BacCandidate[]
    ): Observable<BacCandidate[]> => {
      const url = `${base}${pageIndex}${ext}`;
      return this.http.get(url, { responseType: 'text' }).pipe(
        map((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const table = doc.querySelector('table#mainTable');

          if (!table) {
            // Return null so switchMap stops
            return null;
          }

          const candidates = this.parseHtmlToCandidates(html, county);
          return candidates;
        }),
        switchMap((candidates) => {
          if (!candidates) {
            // No table = done
            return of(accumulated);
          } else {
            return loadPage(pageIndex + 1, accumulated.concat(candidates));
          }
        })
      );
    };

    return loadPage(1, []);
  }

  private parseHtmlToCandidates(html: string, county: string): BacCandidate[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelector('table#mainTable');
    if (!table) {
      console.error(`Table not found for ${county}`);
      return [];
    }

    const rows = Array.from(table.querySelectorAll('tr')); // skip header
    const candidates: BacCandidate[] = [];

    for (let i = 2; i < rows.length; i += 2) {
      const row1 = rows[i];
      const row2 = rows[i + 1];

      if (!row2) continue;

      const cells1 = Array.from(row1.querySelectorAll('td')).map(
        (td) => td.innerText?.trim() || ''
      );
      const cells2 = Array.from(row2.querySelectorAll('td')).map(
        (td) => td.innerText?.trim() || ''
      );

      const candidate: BacCandidate = {
        index: parseInt(cells1[0]),
        code: this.extractCode(cells1[1]),
        posJud: parseInt(cells1[2]),
        posTara: parseInt(cells1[3]),
        school: cells1[4],
        county: county,
        promotie_anterioara: cells1[5],
        forma_invatamant: cells1[6],
        specializare: cells1[7],
        LR: parseFloat(cells1[11]),
        LM: parseFloat(cells2[3]) || null,
        DO: parseFloat(cells2[6]),
        DA: parseFloat(cells2[9]),
        final_avg: null,
        final_res: '',
      };
      this.calculateFinalGrade(candidate);
      candidates.push(candidate);
    }
    return candidates;
  }

  private calculateFinalGrade(candidate: BacCandidate): void {
    const { LR, LM, DO, DA } = candidate;

    if (LR <= 1 || DO <= 1 || DA <= 1) {
      candidate.final_avg = null;
      candidate.final_res = 'NEPREZENTAT';
      return;
    }

    let avg: number;
    if (LM == null) {
      avg = (LR + DO + DA) / 3;
    } else {
      avg = (LR + LM + DO + DA) / 4;
    }

    avg = Math.round(avg * 100) / 100;
    candidate.final_avg = avg;

    if (avg >= 6 && LR >= 5 && DO >= 5 && DA >= 5 && (LM == null || LM >= 5))
      candidate.final_res = 'REUSIT';
    else candidate.final_res = 'RESPINS';
  }

  private extractCode(raw: string): string {
    const match = raw.match(/[A-Z]{2}\d{7}/);
    return match ? match[0] : raw;
  }
}
