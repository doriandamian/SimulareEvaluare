import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface CandidateData {
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

interface ProcessedCandidate extends CandidateData {
  cleanSchool: string;
  cleanSpecialization: string;
  cleanLanguage: string;
  admissionGrade: number;
  overallPosition: number;
}

interface SchoolSpecializationOccupancy {
  school: string;
  specialization: string;
  language: string;
  indexRange: string; // "5-35" format
  minIndex: number;
  maxIndex: number;
  totalSlots: number;
  occupiedSlots: number; // candidates with index < user index
  freeSlots: number; // candidates with index > user index
  occupancyRate: number; // occupied / total * 100
  lastAdmittedGrade: number; // grade corresponding to highest index
  occupancyStatus: 'complet' | 'partial' | 'neocupat';
}

@Component({
  selector: 'app-grad-ocupare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grad-ocupare.component.html',
  styleUrl: './grad-ocupare.component.scss'
})
export class GradOcupareComponent implements OnInit {
  userPosition: number | null = null;
  userGrade: number | null = null;
  allCandidates: ProcessedCandidate[] = [];
  schoolSpecializations: SchoolSpecializationOccupancy[] = [];
  completOcupate: SchoolSpecializationOccupancy[] = [];
  partialOcupate: SchoolSpecializationOccupancy[] = [];
  neocupate: SchoolSpecializationOccupancy[] = [];
  isLoading = false;
  analyzed = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadCandidateData();
  }

  loadCandidateData() {
    this.isLoading = true;
    this.http.get<CandidateData[]>('/assets/en/en2024.json').subscribe({
      next: (data) => {
        this.allCandidates = this.processRawCandidates(data);
        this.processSchoolSpecializations();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading candidate data:', error);
        this.isLoading = false;
      }
    });
  }

  processRawCandidates(rawData: CandidateData[]): ProcessedCandidate[] {
    const validCandidates = rawData
      .filter(candidate => this.isValidCandidate(candidate))
      .map(candidate => ({
        ...candidate,
        cleanSchool: this.cleanSchoolName(candidate.h),
        cleanSpecialization: this.cleanSpecializationName(candidate.sp),
        cleanLanguage: this.cleanLanguageName(candidate.sp),
        admissionGrade: parseFloat(candidate.madm),
        overallPosition: 0 // Will be set after sorting
      }))
      .filter(candidate => !isNaN(candidate.admissionGrade) && candidate.admissionGrade > 0);

    validCandidates.sort((a, b) => b.admissionGrade - a.admissionGrade);
    validCandidates.forEach((candidate, index) => {
      candidate.overallPosition = index + 1;
    });

    return validCandidates;
  }

  isValidCandidate(candidate: CandidateData): boolean {
    return !!(candidate.h && candidate.h.trim() !== '' && 
              candidate.sp && candidate.sp.trim() !== '' &&
              !candidate.sp.includes('Nerepartizat') &&
              !candidate.h.includes('Nerepartizat'));
  }

  cleanSchoolName(schoolHtml: string): string {
    if (!schoolHtml) return '';
    
    const bTagMatch = schoolHtml.match(/<b>(.*?)<\/b>/);
    if (bTagMatch && bTagMatch[1]) {
      return bTagMatch[1].trim();
    }
    
    const textContent = this.extractTextFromHtml(schoolHtml);
    const lines = textContent.split('\n');
    return (lines[0] || textContent).trim();
  }

  cleanSpecializationName(specializationHtml: string): string {
    if (!specializationHtml) return '';
    
    const bTagMatch = specializationHtml.match(/<b>(.*?)<\/b>/);
    let baseSpecialization = '';
    
    if (bTagMatch && bTagMatch[1]) {
      baseSpecialization = bTagMatch[1].trim();
      baseSpecialization = baseSpecialization.replace(/^\(\d+\)\s*/, '');
    } else {
      const textContent = this.extractTextFromHtml(specializationHtml);
      const lines = textContent.split('\n');
      baseSpecialization = lines[0] || textContent;
      baseSpecialization = baseSpecialization.replace(/^\(\d+\)\s*/, '');
    }
    
    return baseSpecialization.trim();
  }

  cleanLanguageName(specializationHtml: string): string {
    if (!specializationHtml) return 'Limba română';
    
    const brMatch = specializationHtml.match(/<br\/?>(.*)$/i);
    if (!brMatch || !brMatch[1]) {
      return 'Limba română';
    }
    
    let languagesPart = brMatch[1].trim();
    
    if (languagesPart.includes('/')) {
      const languages = languagesPart.split('/').map(lang => {
        let cleanLang = lang.trim();
        cleanLang = cleanLang.replace(/^Limba\s+/i, '');
        if (!cleanLang || cleanLang === 'română' || cleanLang === 'romÃ¢nÄƒ') {
          return 'română';
        }
        return cleanLang.charAt(0).toUpperCase() + cleanLang.slice(1);
      });
      
      return `Limba ${languages.join('/')}`;
    } else {
      let language = languagesPart.replace(/^Limba\s+/i, '');
      
      if (!language || language === 'română' || language === 'romÃ¢nÄƒ') {
        return 'Limba română';
      } else {
        language = language.charAt(0).toUpperCase() + language.slice(1);
        return `Limba ${language}`;
      }
    }
  }

  private extractTextFromHtml(htmlString: string): string {
    if (!htmlString) return '';
    
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || '';
  }

  processSchoolSpecializations() {
    const specializationMap = new Map<string, ProcessedCandidate[]>();
    
    // Group candidates by school + specialization + language
    this.allCandidates.forEach(candidate => {
      const key = `${candidate.cleanSchool}|${candidate.cleanSpecialization}|${candidate.cleanLanguage}`;
      if (!specializationMap.has(key)) {
        specializationMap.set(key, []);
      }
      specializationMap.get(key)!.push(candidate);
    });

    this.schoolSpecializations = Array.from(specializationMap.entries()).map(([key, candidates]) => {
      const [school, specialization, language] = key.split('|');
      
      // Sort candidates by position (lowest position = best, highest position = worst)
      const sortedCandidates = candidates.sort((a, b) => a.overallPosition - b.overallPosition);
      const bestCandidate = sortedCandidates[0]; 
      const worstCandidate = sortedCandidates[sortedCandidates.length - 1];
      
      return {
        school,
        specialization,
        language,
        indexRange: `${bestCandidate.overallPosition}-${worstCandidate.overallPosition}`,
        minIndex: bestCandidate.overallPosition,
        maxIndex: worstCandidate.overallPosition,
        totalSlots: candidates.length,
        occupiedSlots: 0,
        freeSlots: 0, 
        occupancyRate: 0, 
        lastAdmittedGrade: worstCandidate.admissionGrade,
        occupancyStatus: 'complet' as const
      };
    }).sort((a, b) => a.minIndex - b.minIndex);
  }

  analyzeOccupancy() {
    if (this.userPosition === null) return;

    // Find the user's corresponding grade based on position
    if (this.userPosition <= this.allCandidates.length) {
      this.userGrade = this.allCandidates[this.userPosition - 1].admissionGrade;
    } else {
      // Position is beyond all candidates, use minimum grade
      this.userGrade = Math.min(...this.allCandidates.map(c => c.admissionGrade)) - 0.1;
    }

    this.completOcupate = [];
    this.partialOcupate = [];
    this.neocupate = [];

    this.schoolSpecializations.forEach(spec => {
      const candidatesAtSpecialization = this.allCandidates.filter(c => 
        c.cleanSchool === spec.school && 
        c.cleanSpecialization === spec.specialization && 
        c.cleanLanguage === spec.language
      );
      
      // Count candidates with better/worse positions than user
      spec.occupiedSlots = candidatesAtSpecialization.filter(c => c.overallPosition < this.userPosition!).length;
      spec.freeSlots = candidatesAtSpecialization.filter(c => c.overallPosition >= this.userPosition!).length;
      spec.occupancyRate = Math.floor((spec.occupiedSlots / spec.totalSlots) * 10000) / 100;
      
      // Determine occupancy status based on user position vs index range
      if (this.userPosition! > spec.maxIndex) {
        spec.occupancyStatus = 'complet';
        this.completOcupate.push(spec);
      } else if (this.userPosition! > spec.minIndex && this.userPosition! <= spec.maxIndex) {
        spec.occupancyStatus = 'partial';
        this.partialOcupate.push(spec);
      } else {
        spec.occupancyStatus = 'neocupat';
        this.neocupate.push(spec);
      }
    });

    this.neocupate.sort((a, b) => a.occupancyRate - b.occupancyRate);
    this.partialOcupate.sort((a, b) => a.occupancyRate - b.occupancyRate);
    this.completOcupate.sort((a, b) => b.occupancyRate - a.occupancyRate);

    this.analyzed = true;
  }

  goBack() {
    history.back();
  }
}
