import { Listening } from './listening.model';
import { Reading } from './reading.model';

export interface Quiz {
  id: string;
  name: string;
  timeout: number | null;
  listeningParts: Listening[];
  readingParts: Reading[];
}
