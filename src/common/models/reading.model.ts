import { Question } from './question.model';

export interface Reading {
  id: string;
  content: string;
  questions: Question[];
}
