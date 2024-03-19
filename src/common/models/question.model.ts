import { Choice } from './choice.model';

export interface Question {
  id?: string;
  name?: string;
  content?: string;
  type?: number | null;
  choices: Choice[];
  answer: string;
  correctAnswer?: string;
  imageName?: string;
}
