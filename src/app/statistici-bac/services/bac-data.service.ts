import { Injectable } from '@angular/core';
import bacData from '../../statistici-bac/assets/bac-data.json';

@Injectable({ providedIn: 'root' })
export class BacDataService {
  private rawData: any[][] = [];

  loadData(): any[][] {
    this.rawData = bacData.slice(1);
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
