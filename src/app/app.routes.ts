import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MockTestComponent } from './mock-test/mock-test.component';
import { AddOrEditQuizComponent } from './modules/quizzes/add-or-edit-quiz/add-or-edit-quiz.component';
import { ReadingComponent } from './reading/reading.component';
import { ResultDetailComponent } from './modules/result/result-detail/result-detail.component';
import { ResultComponent } from './modules/result/result.component';
import { TestComponent } from './modules/test/test.component';
import { WritingTestComponent } from './modules/writing-test/writing-test.component';
import { AddOrEditWritingComponent } from './modules/writing-test/add-or-edit-writing/add-or-edit-writing.component';
import { SelfReadingComponent } from './modules/self-learning/self-reading/self-reading.component';
import { SelfReadingDetailComponent } from './modules/self-learning/self-reading-detail/self-reading-detail.component';
import { SelfReadingTestComponent } from './modules/self-learning/self-reading-test/self-reading-test.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'writings', component: WritingTestComponent },
  { path: 'add-writing', component: AddOrEditWritingComponent },
  { path: 'result-writing/:id', component: AddOrEditWritingComponent },
  { path: 'edit-writing/:id', component: AddOrEditWritingComponent },
  { path: 'test-writing/:id', component: AddOrEditWritingComponent },
  {
    path: 'continue-test-writing/:testId',
    component: AddOrEditWritingComponent,
  },
  { path: 'mock-test', component: MockTestComponent },
  {
    path: 'mock-test/:folderId',
    loadChildren: () =>
      import('./modules/quizzes/quizzes.routes').then((m) => m.routes),
  },
  { path: 'add-quiz', component: AddOrEditQuizComponent },
  { path: 'edit-quiz/:quizId', component: AddOrEditQuizComponent },
  { path: 'test/:resultId', component: TestComponent },
  { path: 'continue-test/:testId', component: TestComponent },
  { path: 'add-reading', component: ReadingComponent },
  { path: 'edit-reading/:quizId', component: ReadingComponent },
  { path: 'reading/:quizId', component: ReadingComponent },
  { path: 'results', component: ResultComponent, outlet: 'home' },
  { path: 'result-detail/:resultId', component: ResultDetailComponent },
  { path: 'self-learning/teacher', component: SelfReadingComponent },
  { path: 'self-learning/student', component: SelfReadingComponent },
  {
    path: 'self-learning/teacher/:readingId',
    component: SelfReadingDetailComponent,
  },
  {
    path: 'self-learning/student/:readingId',
    component: SelfReadingDetailComponent,
  },
  {
    path: 'self-learning/test/:readingId',
    component: SelfReadingTestComponent,
  },
];
