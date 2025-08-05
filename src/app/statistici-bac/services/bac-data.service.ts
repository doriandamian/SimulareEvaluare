import { Injectable } from '@angular/core';
import { BacCacheService } from '../../services/bac.cache.service';
import { BacUrls } from '../../assets/bac.urls';
import { COUNTY_NAMES } from '../../assets/county-names';

export interface CountyOption {
  code: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class BacDataService {
  private rawData: any[][] = [];
  private initialized = false;

  constructor(private bacCacheService: BacCacheService) {}

  async getAvailableCounties(): Promise<CountyOption[]> {
    // Return the list of available counties with both code and name
    return Object.keys(BacUrls).map(code => ({
      code,
      name: COUNTY_NAMES[code] || code
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  async loadData(county?: string): Promise<any[][]> {
    if (!county) {
      this.rawData = [];
      return this.rawData;
    }

    try {
      // Load raw JSON data directly for the county
      const url = `assets/bac_data/bac_data_${county}.json`;
      const response = await fetch(url);
      const rawCountyData = await response.json();
      
      if (Array.isArray(rawCountyData) && rawCountyData.length > 0) {
        // Filter out empty rows and keep the original structure
        this.rawData = rawCountyData.filter(row => 
          Array.isArray(row) && row.length > 19 && row[4] // Must have school name and complete data
        );
      } else {
        this.rawData = [];
      }
    } catch (error) {
      console.error(`Failed to load data for county ${county}:`, error);
      this.rawData = [];
    }

    return this.rawData;
  }

  private async initializeCache(): Promise<void> {
    if (!this.initialized) {
      await this.bacCacheService.init().toPromise();
      this.initialized = true;
    }
  }

  getSchools(data: any[][]): string[] {
    return Array.from(new Set(data.map((row) => row[4]))); // School name is at index 4
  }

  getSpecialisations(data: any[][]): string[] {
    return Array.from(new Set(data.map((row) => row[7]))); // Specialization is at index 7
  }

  filterData(data: any[][], school: string, specialisation: string): any[][] {
    return data.filter(
      (row) =>
        (school === 'Toate' || row[4] === school) &&  // School name is at index 4
        (specialisation === 'Toate' || row[7] === specialisation)  // Specialization is at index 7
    );
  }
}
