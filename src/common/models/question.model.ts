import { Choice } from './choice.model';

export interface Question {
  id: string;
  name?: string;
  content?: string;
  arrayContent?: string[][];
  type?: number | null;
  answer: string[] | string;
  correctAnswer: string[];
  choices: Choice[];
  subQuestions?: Question[];
  numberOfChoices?: number;
}
