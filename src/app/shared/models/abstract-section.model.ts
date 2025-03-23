import { Part } from './part.model';

export interface AbstractSection {
  _id?: string;
  description?: string;
  name?: string;
  content: string;
  timeout: number;
  parts: Part[];
  quizId?: string;
}
