import { Choice } from './choice.model';
import { QuestionType } from '../enums/question-type.enum';

export interface Question {
  _id?: string;
  name?: string;
  description?: string;
  arrayContent?: string[][];
  tableContent?: Record<string, Record<string, string[][]>>;
  type: QuestionType;
  answer: string[] | string;
  correctAnswer: string[];
  choices: Choice[];
  subQuestions?: Question[];
  numberOfChoices?: number;
  isAnswer?: boolean;
  answers?: Choice[];
  partId?: string;
}
