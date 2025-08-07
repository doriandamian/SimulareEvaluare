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
          LR: this.parseGrade(row[9]), // Romanian language grade at index 9
          LM: this.parseGrade(row[11]), // Mother language grade at index 11  
          DO: this.parseGrade(row[24]), // Mandatory subject grade at index 24
          DA: this.parseGrade(row[26]), // Optional subject grade at index 26
          final_avg: this.parseFinalAverage(row[18]), // Final average is already calculated in raw data at index 18
          final_res: row[19] || '', // Final result at index 19
        };

        return candidate;
      })
      .filter((candidate) => candidate.code !== '' && candidate.school !== '');
  }

  private parseGrade(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 1;
    }
    const numValue = parseFloat(String(value).replace(',', '.'));
    return isNaN(numValue) ? 1 : numValue;
  }

  private parseFinalAverage(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const numValue = parseFloat(String(value).replace(',', '.'));
    return isNaN(numValue) ? null : numValue;
  }

  private extractCode(raw: string): string {
    const match = raw.match(/[A-Z]{2}\d{7}/);
    return match ? match[0] : raw;
  }
}
