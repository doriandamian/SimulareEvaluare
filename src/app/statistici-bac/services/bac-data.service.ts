import { Injectable } from '@angular/core';
import { BacCacheService } from '../../services/bac.cache.service';
import { BacUrls } from '../../assets/bac.urls';
import { COUNTY_NAMES } from '../../assets/county-names';
import { BacCandidate } from '../../model/bac.candidate';

export interface CountyOption {
  code: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class BacDataService {
  private initialized = false;

  constructor(private bacCacheService: BacCacheService) { }

  async getAvailableCounties(): Promise<CountyOption[]> {
    return Object.keys(BacUrls).map(code => ({
      code,
      name: COUNTY_NAMES[code] || code
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  async loadData(county?: string): Promise<any[][]> {
    if (!county) {
      return [];
    }

    await this.initializeCache();

    const cachedData = this.bacCacheService.getCountyData(county);

    return cachedData.map(candidate => this.convertCandidateToRaw(candidate));
  }

  private async initializeCache(): Promise<void> {
    if (!this.initialized) {
      await this.bacCacheService.init().toPromise();
      this.initialized = true;
    }
  }

  private convertCandidateToRaw(candidate: BacCandidate): any[] {
    // Convert BacCandidate back to the raw array format expected by the component
    const raw = new Array(20).fill('');
    raw[0] = candidate.index;
    raw[1] = candidate.code;
    raw[2] = candidate.posJud;
    raw[3] = candidate.posTara;
    raw[4] = candidate.school;
    raw[5] = candidate.promotie_anterioara;
    raw[6] = candidate.forma_invatamant;
    raw[7] = candidate.specializare;
    raw[10] = candidate.LR;
    raw[11] = candidate.LM !== null ? candidate.LM : '';
    raw[15] = candidate.DO;
    raw[16] = candidate.DA;
    raw[18] = candidate.final_avg !== null ? candidate.final_avg : '';
    raw[19] = candidate.final_res;
    return raw;
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
        (school === 'Toate' || row[4] === school) &&
        (specialisation === 'Toate' || row[7] === specialisation)
    );
  }
}
