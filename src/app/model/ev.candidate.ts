export interface EvCandidate {
  index: number;
  county: string;
  name: string;
  school: string;
  schoolCode: string;
  ri: number | null; // Romanian language initial score
  ra: number | null; // Romanian language appeal score
  rf: number | null; // Romanian language final score
  mi: number | null; // Math initial score
  ma: number | null; // Math appeal score
  mf: number | null; // Math final score
  lmp: string; // Language of minority spoken
  lmi: number | null; // Minority language initial score
  lma: number | null; // Minority language appeal score
  lmf: number | null; // Minority language final score
  mev: number | null; // Admission average
}
