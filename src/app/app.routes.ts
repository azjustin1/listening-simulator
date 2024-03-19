import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddOrEditQuizComponent } from './quizzes/add-or-edit-quiz/add-or-edit-quiz.component';
import { ReadingComponent } from './reading/reading.component';
import { ResultDetailComponent } from './result/result-detail/result-detail.component';
import { ResultComponent } from './result/result.component';
import { TestComponent } from './test/test.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-quiz', component: AddOrEditQuizComponent },
  { path: 'edit-quiz/:quizId', component: AddOrEditQuizComponent },
  { path: 'test/:quizId', component: TestComponent },
  { path: 'add-reading', component: ReadingComponent },
  { path: 'edit-reading/:quizId', component: ReadingComponent },
  { path: 'reading/:quizId', component: ReadingComponent },
  { path: 'results', component: ResultComponent, outlet: 'home' },
  { path: 'result-detail/:resultId', component: ResultDetailComponent },
];
