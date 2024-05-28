import { Listening } from './listening.model';
import { Reading } from './reading.model';
import { Writing } from './writing.model';

export interface Quiz {
  id: string;
  name: string;
  audioName?: string;
  audioUrl?: string;
  listeningTimeout?: number;
  readingTimeout?: number;
  writingTimeout?: number;
  listeningParts: Listening[];
  readingParts: Reading[];
  writingParts: Writing[];
}
