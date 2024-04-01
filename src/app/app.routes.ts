import { Routes } from '@angular/router';
import { AddEditWritingComponent } from './add-edit-writing/add-edit-writing.component';
import { HomeComponent } from './home/home.component';
import { MockTestComponent } from './mock-test/mock-test.component';
import { AddOrEditQuizComponent } from './quizzes/add-or-edit-quiz/add-or-edit-quiz.component';
import { ReadingComponent } from './reading/reading.component';
import { ResultDetailComponent } from './result/result-detail/result-detail.component';
import { ResultComponent } from './result/result.component';
import { TestComponent } from './test/test.component';
import { WritingTestComponent } from './writing-test/writing-test.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'writings', component: WritingTestComponent },
  { path: 'add-writing', component: AddEditWritingComponent },
  { path: 'edit-writing/:id', component: AddEditWritingComponent },
  { path: 'mock-test', component: MockTestComponent },
  { path: 'add-quiz', component: AddOrEditQuizComponent },
  { path: 'edit-quiz/:quizId', component: AddOrEditQuizComponent },
  { path: 'test/:quizId', component: TestComponent },
  { path: 'add-reading', component: ReadingComponent },
  { path: 'edit-reading/:quizId', component: ReadingComponent },
  { path: 'reading/:quizId', component: ReadingComponent },
  { path: 'results', component: ResultComponent, outlet: 'home' },
  { path: 'result-detail/:resultId', component: ResultDetailComponent },
];
