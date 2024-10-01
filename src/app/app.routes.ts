import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MockTestComponent } from './pages/mock-test/mock-test.component';
import { AddOrEditQuizComponent } from './modules/quizzes/add-or-edit-quiz/add-or-edit-quiz.component';
import { ReadingComponent } from './tabs/reading/reading.component';
import { ResultDetailComponent } from './modules/result/result-detail/result-detail.component';
import { ResultComponent } from './modules/result/result.component';
import { FullTestComponent } from './pages/full-test/full-test.component';
import { WritingTestComponent } from './pages/writing-test/writing-test.component';
import { AddOrEditWritingComponent } from './pages/writing-test/add-or-edit-writing/add-or-edit-writing.component';

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
  { path: 'test/:resultId', component: FullTestComponent },
  { path: 'continue-test/:testId', component: FullTestComponent },
  { path: 'add-reading', component: ReadingComponent },
  { path: 'edit-reading/:quizId', component: ReadingComponent },
  { path: 'reading/:quizId', component: ReadingComponent },
  { path: 'results', component: ResultComponent, outlet: 'home' },
  { path: 'result-detail/:resultId', component: ResultDetailComponent },
];
