import { Question } from './question.model';

export interface Listening {
  id?: string;
  name: string;
  audioName: string;
  questions: Question[];
}
