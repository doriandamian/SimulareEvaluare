import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BacCandidate } from '../model/bac.candidate';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { BacUrls } from '../assets/bac.urls';

@Injectable({
  providedIn: 'root',
})
export class BacCacheService {
  private cache = new Map<string, BacCandidate[]>();

  constructor(private http: HttpClient) {}

  init(): Observable<BacCandidate[]> {
    const counties = Object.entries(BacUrls);

    const allCountyRequests = counties.map(([county, jsonUrl]) =>
      this.loadCountyData(county, jsonUrl)
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

  getAvailableCounties(): string[] {
    return Object.keys(BacUrls);
  }

  getBacData(county: string): BacCandidate[] {
    return this.getCountyData(county);
  }

  private loadCountyData(
    county: string,
    jsonUrl: string
  ): Observable<BacCandidate[]> {
    return this.http.get<any[]>(jsonUrl).pipe(
      map((rawData) => this.processRawData(rawData, county)),
      catchError((error) => {
        console.error(`Failed to load data for county ${county}:`, error);
        return of([]);
      })
    );
  }

  private processRawData(rawData: any[], county: string): BacCandidate[] {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    // Skip header row and empty rows
    const dataRows = rawData
      .slice(1)
      .filter((row) => Array.isArray(row) && row.length > 15);

    return dataRows
      .map((row, index) => {
        const candidate: BacCandidate = {
          index: index + 1,
          code: this.extractCode(row[1] || ''), // Code is at index 1
          posJud: parseInt(row[2]) || 0,
          posTara: parseInt(row[3]) || 0,
          school: row[4] || '', // School name is at index 4
          county: county,
          promotie_anterioara: row[5] || '',
          forma_invatamant: row[6] || '',
          specializare: row[7] || '', // Specialization is at index 7
          LR: this.parseGrade(row[10]), // Romanian language grade
          LM: this.parseGrade(row[11]), // Mother tongue grade
          DO: this.parseGrade(row[15]), // Mandatory subject grade
          DA: this.parseGrade(row[16]), // Optional subject grade
          final_avg: null,
          final_res: '',
        };

        this.calculateFinalResults(candidate);
        return candidate;
      })
      .filter((candidate) => candidate.code !== '' && candidate.school !== '');
  }

  private parseGrade(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 1; // Default for missing grades
    }
    const numValue = parseFloat(String(value).replace(',', '.'));
    return isNaN(numValue) ? 1 : numValue;
  }

  private calculateFinalResults(candidate: BacCandidate): void {
    const { LR, LM, DO, DA } = candidate;

    if (LR <= 1 || DO <= 1 || DA <= 1) {
      candidate.final_avg = null;
      candidate.final_res = 'NEPREZENTAT';
      return;
    }

    let avg: number;
    if (LM == null || LM <= 1) {
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
