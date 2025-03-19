import { AbstractSection } from './abstract-section.model';

export interface Writing extends AbstractSection {
  studentName?: string;
  answer: string;
  isSubmit?: boolean;
  wordCount: number;
  testDate?: string;
}
