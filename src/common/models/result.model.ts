import { Quiz } from './quiz.model';

export interface Result extends Quiz {
  studentName: string;
  correctPoint: number;
  totalPoint: number;
  testDate: string;
  quizId: string;
}
