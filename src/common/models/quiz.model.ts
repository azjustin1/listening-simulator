import { Listening } from './listening.model';
import { Reading } from './reading.model';
import { Writing } from './writing.model';

export interface Quiz {
  _id?: string;
  id: string;
  name: string;
  audioName?: string;
  audioUrl?: string;
  audioTime?: number;
  listeningTimeout?: number;
  readingTimeout?: number;
  writingTimeout?: number;
  listeningParts: Listening[];
  readingParts: Reading[];
  writingParts: Writing[];
}
