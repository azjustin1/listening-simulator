import { Quiz } from './quiz.model';
import { Listening } from './listening.model';
import { Reading } from './reading.model';
import { Writing } from './writing.model';

export interface Test {
  _id?: string;
  quizName: string;
  studentName: string;
  correctListeningPoint: number;
  totalListeningPoint: number;
  correctReadingPoint: number;
  totalReadingPoint: number;
  listening: Listening;
  reading: Reading;
  writing: Writing;
  testDate: string;
  quizId: string;
  isFinished: boolean;
  currentTab?: number;
  feedback?: Feedback;
  answers?: Record<string, string[]>;
}

export interface Feedback {
  rating: number;
  content: string;
}
