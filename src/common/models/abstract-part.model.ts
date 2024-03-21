import { Question } from './question.model';

export interface AbstractPart {
  id: string;
  content: string;
  questions: Question[];
  imageName?: string;
}
