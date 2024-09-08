import { Question } from './question.model';

export interface AbstractPart {
  _id?: string;
  id?: string;
  content: string;
  timeout: number | undefined;
  questions: Question[];
  wordCount: number;
  testDate: string;
}
