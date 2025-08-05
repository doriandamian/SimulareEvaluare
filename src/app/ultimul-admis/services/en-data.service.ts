import { Injectable } from '@angular/core';

export interface CandidateData {
  ja: string;
  n: string;
  jp: string;
  s: string;
  sc: string;
  madm: string;
  mev: string;
  mabs: string;
  nro: string;
  nmate: string;
  lm: string;
  nlm: string;
  h: string;
  sp: string;
}

export interface ProcessedCandidate extends CandidateData {
  year: number;
  overallIndex: number;
  cleanSchool: string;
  cleanSpecialization: string;
}

export interface YearlyAdmissionData {
  year: number;
  lastAdmittedIndex: number;
  lastAdmittedGrade: number;
  totalCandidates: number;
}

export interface SchoolSpecialization {
  school: string;
  specialization: string;
  yearlyData: YearlyAdmissionData[];
}

@Injectable({
  providedIn: 'root'
})
export class EnDataService {
  private candidatesCache: Map<number, CandidateData[]> = new Map();
  private allCandidatesCache: ProcessedCandidate[] | null = null;

  constructor() { }

  clearCache() {
    this.candidatesCache.clear();
    this.allCandidatesCache = null;
  }

  async loadAllCandidates(): Promise<ProcessedCandidate[]> {
    if (this.allCandidatesCache) {
      return this.allCandidatesCache;
    }

    const years = [2022, 2023, 2024];
    const allCandidates: ProcessedCandidate[] = [];
    
    for (const year of years) {
      const yearCandidates = await this.loadCandidates(year);
      const validCandidates = yearCandidates.filter(candidate => this.isValidCandidate(candidate));
      
      validCandidates.sort((a, b) => parseFloat(b.madm) - parseFloat(a.madm));
      
      validCandidates.forEach((candidate, index) => {
        const cleanSchool = this.cleanSchoolName(candidate.h);
        const cleanSpecialization = this.cleanSpecializationName(candidate.sp);
        
        allCandidates.push({
          ...candidate,
          year,
          overallIndex: index + 1,
          cleanSchool,
          cleanSpecialization
        });
      });
    }

    this.allCandidatesCache = allCandidates;
    return allCandidates;
  }

  async loadCandidates(year: number): Promise<CandidateData[]> {
    if (this.candidatesCache.has(year)) {
      return this.candidatesCache.get(year)!;
    }

    try {
      const response = await fetch(`/assets/en/en${year}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load EN data for year ${year}`);
      }
      
      const data = await response.json();
      this.candidatesCache.set(year, data);
      return data;
    } catch (error) {
      console.error(`Error loading EN data for ${year}:`, error);
      return [];
    }
  }

  async processAdmissionData(): Promise<SchoolSpecialization[]> {
    const allCandidates = await this.loadAllCandidates();
    
    const groupedData = new Map<string, ProcessedCandidate[]>();
    
    allCandidates.forEach(candidate => {
      const key = `${candidate.cleanSchool}|${candidate.cleanSpecialization}`;
      
      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }
      
      groupedData.get(key)!.push(candidate);
    });

    const results: SchoolSpecialization[] = [];
    
    groupedData.forEach((candidates, key) => {
      const [school, specialization] = key.split('|');
      
      const yearlyStats = new Map<number, YearlyAdmissionData>();
      
      candidates.forEach(candidate => {
        if (!yearlyStats.has(candidate.year)) {
          yearlyStats.set(candidate.year, {
            year: candidate.year,
            lastAdmittedIndex: 0,
            lastAdmittedGrade: 0,
            totalCandidates: 0
          });
        }
      });
      
      yearlyStats.forEach((stats, year) => {
        const yearCandidates = candidates.filter(c => c.year === year);
        const sortedByIndex = yearCandidates.sort((a, b) => a.overallIndex - b.overallIndex);
        
        stats.totalCandidates = yearCandidates.length;
        if (sortedByIndex.length > 0) {
          const lastAdmitted = sortedByIndex[sortedByIndex.length - 1];
          stats.lastAdmittedIndex = lastAdmitted.overallIndex;
          stats.lastAdmittedGrade = parseFloat(lastAdmitted.madm);
        }
      });
      
      results.push({
        school,
        specialization,
        yearlyData: Array.from(yearlyStats.values()).sort((a, b) => a.year - b.year)
      });
    });

    return results.sort((a, b) => a.school.localeCompare(b.school));
  }

  private isValidCandidate(candidate: CandidateData): boolean {
    return !!(candidate.h && candidate.h.trim() !== '' && 
              candidate.sp && candidate.sp.trim() !== '' &&
              !candidate.sp.includes('Nerepartizat') &&
              !candidate.h.includes('Nerepartizat'));
  }

  private cleanSchoolName(htmlString: string): string {
    if (!htmlString) return '';
    
    const bTagMatch = htmlString.match(/<b>(.*?)<\/b>/);
    if (bTagMatch && bTagMatch[1]) {
      return bTagMatch[1].trim();
    }
    
    const textContent = this.extractTextFromHtml(htmlString);
    const lines = textContent.split('\n');
    return (lines[0] || textContent).trim();
  }

  private cleanSpecializationName(htmlString: string): string {
    if (!htmlString) return '';
    
    const bTagMatch = htmlString.match(/<b>(.*?)<\/b>/);
    let baseSpecialization = '';
    
    if (bTagMatch && bTagMatch[1]) {
      baseSpecialization = bTagMatch[1].trim();
      baseSpecialization = baseSpecialization.replace(/^\(\d+\)\s*/, '');
    } else {
      const textContent = this.extractTextFromHtml(htmlString);
      const lines = textContent.split('\n');
      baseSpecialization = lines[0] || textContent;
      baseSpecialization = baseSpecialization.replace(/^\(\d+\)\s*/, '');
    }
    
    const brMatch = htmlString.match(/<br\/?>(.*)$/i);
    if (!brMatch || !brMatch[1]) {
      return baseSpecialization.trim();
    }
    
    let languagesPart = brMatch[1].trim();
    
    if (languagesPart.includes('/')) {
      const languages = languagesPart.split('/').map(lang => {
        let cleanLang = lang.trim();
        cleanLang = cleanLang.replace(/^Limba\s+/i, '');
        return cleanLang.charAt(0).toUpperCase() + cleanLang.slice(1);
      });
      
      const languageString = languages.join('/');
      return `${baseSpecialization} - ${languageString}`;
    } else {
      let language = languagesPart.replace(/^Limba\s+/i, '');
      
      if (language && language !== 'română' && language !== 'romÃ¢nÄƒ') {
        language = language.charAt(0).toUpperCase() + language.slice(1);
        return `${baseSpecialization} - ${language}`;
      } else {
        return baseSpecialization;
      }
    }
  }

  private extractTextFromHtml(htmlString: string): string {
    if (!htmlString) return '';
    
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || '';
  }

  getUniqueSchools(data: SchoolSpecialization[]): string[] {
    const schools = [...new Set(data.map(item => item.school))];
    return schools.sort();
  }

  getSpecializationsForSchool(data: SchoolSpecialization[], school: string): string[] {
    const specializations = data
      .filter(item => item.school === school)
      .map(item => item.specialization);
    return [...new Set(specializations)].sort();
  }

  filterData(data: SchoolSpecialization[], school?: string, specialization?: string): SchoolSpecialization[] {
    let filtered = data;
    
    if (school) {
      filtered = filtered.filter(item => item.school === school);
    }
    
    if (specialization) {
      filtered = filtered.filter(item => item.specialization === specialization);
    }
    
    return filtered;
  }
}
