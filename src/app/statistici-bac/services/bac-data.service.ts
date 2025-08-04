import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BacDataService {
  private rawData: any[][] = [];

  async loadData(): Promise<any[][]> {
    if (this.rawData.length) return this.rawData;

    const response = await fetch('assets/bac/bac-data.json');
    const data = await response.json();
    this.rawData = data.slice(1);
    return this.rawData;
  }

  getSchools(data: any[][]): string[] {
    return Array.from(new Set(data.map((row) => row[2])));
  }

  getSpecialisations(data: any[][]): string[] {
    return Array.from(new Set(data.map((row) => row[5])));
  }

  filterData(data: any[][], school: string, specialisation: string): any[][] {
    return data.filter(
      (row) =>
        (school === 'Toate' || row[2] === school) &&
        (specialisation === 'Toate' || row[5] === specialisation)
    );
  }
}
