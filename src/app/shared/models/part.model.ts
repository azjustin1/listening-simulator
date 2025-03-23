import { Question } from './question.model';

export interface Part {
  _id?: string;
  questions: Question[];
  isMatchHeader?: boolean;
  sectionId?: string;
}
