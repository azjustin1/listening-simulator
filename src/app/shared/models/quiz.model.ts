import { Listening } from './listening.model';
import { Reading } from './reading.model';
import { Writing } from './writing.model';

export interface Quiz {
  _id?: string;
  name: string;
  listeningTimeout?: number;
  readingTimeout?: number;
  writingTimeout?: number;
  listening: Listening;
  reading: Reading;
  writing: Writing;
  folderId?: string | null;
  order?: number;
}
