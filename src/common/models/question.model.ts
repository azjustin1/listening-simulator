import { Choice } from './choice.model';

export interface Question {
  _id?: string;
  id: string;
  name?: string;
  content?: string;
  arrayContent?: string[][];
  type?: number | null;
  choices: Choice[];
  answer: string[] | string;
  correctAnswer: string[];
  subQuestions?: Question[];
}
