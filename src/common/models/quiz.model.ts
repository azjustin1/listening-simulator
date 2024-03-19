import { Listening } from './listening.model';
import { Question } from './question.model';

export interface Quiz {
  id: string;
  name: string;
  timeout: number | null;
  listeningParts: Listening[];
}
