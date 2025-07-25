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

  getUnitati(data: any[][]): string[] {
    return Array.from(new Set(data.map((row) => row[2])));
  }

  getSpecializari(data: any[][]): string[] {
    return Array.from(new Set(data.map((row) => row[5])));
  }

  filterData(data: any[][], unitate: string, specializare: string): any[][] {
    return data.filter(
      (row) =>
        (unitate === 'Toate' || row[2] === unitate) &&
        (specializare === 'Toate' || row[5] === specializare)
    );
  }
}
