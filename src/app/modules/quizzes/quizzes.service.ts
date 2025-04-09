import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Quiz } from '../../shared/models/quiz.model';
import { Listening } from '../../shared/models/listening.model';
import { SectionType } from '../../shared/enums/section-type.enum';
import { AbstractSection } from '../../shared/models/abstract-section.model';
import { Part } from '../../shared/models/part.model';
import { Question } from '../../shared/models/question.model';

@Injectable()
export class QuizService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Quiz[]> {
    return this.httpClient.get<Quiz[]>(`/quizzes`);
  }

  searchByName(name: string): Observable<any> {
    return this.httpClient.get(`/quizzes?name_like=${name}`);
  }

  getAllQuizzesByFolderId(folderId: string): Observable<Quiz[]> {
    return this.httpClient.get<Quiz[]>(`/quizzes?folderId=${folderId}`).pipe(
      tap((results: Quiz[]) => {
        results.sort((a, b) => a.order! - b.order!);
      }),
    );
  }

  getById(quizId: string): Observable<Quiz> {
    return this.httpClient.get<Quiz>(`/quizzes/${quizId}`);
  }

  create(quiz: Quiz): Observable<Quiz> {
    return this.httpClient.post<Quiz>(`/quizzes`, quiz);
  }

  edit(quiz: Quiz): Observable<any> {
    return this.httpClient.put(`/quizzes/${quiz._id}`, quiz);
  }

  updateIndex(quizIds: string[]) {
    const requestBody = {
      quizIds: quizIds,
    };
    return this.httpClient.patch<Quiz[]>('/quizz/update-index', requestBody);
  }

  moveToFolder(
    quizIds: string[],
    folderId: string | undefined,
  ): Observable<Quiz[]> {
    const requestBody = {
      quizIds: quizIds,
      folderId: folderId,
    };
    return this.httpClient.patch<Quiz[]>('/quizz/move', requestBody);
  }

  delete(quizId?: string): Observable<any> {
    return this.httpClient.delete(`/quizzes/${quizId}`);
  }

  uploadAudioFile(sectionId: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(
      `/quizzes/${sectionId}/upload-audio`,
      formData,
    );
  }

  removeAudioFile(sectionId: string): Observable<any> {
    return this.httpClient.delete(`/quizzes/${sectionId}/remove-audio`);
  }

  updateSection(
    quizId: string,
    sectionType: SectionType,
  ): Observable<AbstractSection> {
    const requestBody = {
      quizId: quizId,
      sectionType: sectionType,
    };
    return this.httpClient.post<AbstractSection>(
      `/quizzes/${quizId}/section`,
      requestBody,
    );
  }

  addNewQuestion(questionData: Question): Observable<Question> {
    return this.httpClient.post<Question>(`/questions`, questionData);
  }

  updateQuestion(question: Question): Observable<Question> {
    return this.httpClient.put<Question>(
      `/questions/${question._id!}`,
      question,
    );
  }
}
