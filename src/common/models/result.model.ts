import { Quiz } from './quiz.model';

export interface Result extends Quiz {
  studentName: string;
  correctListeningPoint: number;
  totalListeningPoint: number;
  correctReadingPoint: number;
  totalReadingPoint: number;
  testDate: string;
  quizId: string;
}
