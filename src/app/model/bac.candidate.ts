export interface BacCandidate {
  index: number;
  code: string;
  posJud: number;
  posTara: number;
  school: string;
  county: string;
  promotie_anterioara: string;
  forma_invatamant: string;
  specializare: string;
  LR: number; // Limba Romana Nota Finala
  LM: number | null; // Limba Materna Nota Finala
  DO: number; // Disciplina Obligatorie Nota Finala
  DA: number; // Disciplina la Alegere Nota Finala
  final_avg: number | null;
  final_res: string;
}
