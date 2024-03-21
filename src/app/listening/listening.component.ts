import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { Listening } from '../../common/models/listening.model';
import { CommonUtils } from '../../utils/common-utils';
import { FileService } from '../file.service';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { ListeningService } from './listening.service';
import { Question } from '../../common/models/question.model';
import { each } from 'lodash-es';
import { AbstractQuizPartComponent } from '../../common/abstract-quiz-part.component';

@Component({
  selector: 'app-listening',
  standalone: true,
  imports: [
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MultipleChoicesComponent,
    ShortAnswerComponent,
    MatIconModule,
  ],
  providers: [ListeningService, FileService],
  templateUrl: './listening.component.html',
  styleUrl: './listening.component.css',
})
export class ListeningComponent
  extends AbstractQuizPartComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() data: Listening = {
    name: '',
    questions: [],
    audioName: '',
  };

  @ViewChild('audioPlayer') audioPlayer!: ElementRef;

  audioUrl: string = '';
  selectedFile!: File;

  subscription: Subscription[] = [];

  ngOnInit(): void {
    each(this.data.questions, (question) => {
      this.mapQuestionEditting[question.id!] = false;
    });
  }

  ngAfterViewInit(): void {
    this.getAudioFile(this.data.audioName);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getAudioFile(fileName: string) {
    if (fileName !== '' && this.isTesting) {
      this.fileService.getFile(fileName).subscribe((audioFile: Blob) => {
        const fileURL = URL.createObjectURL(audioFile);
        const audioElement: HTMLAudioElement = this.audioPlayer.nativeElement;
        this.audioUrl = fileURL;
        audioElement.load();
      });
    }
  }

  addQuestion(questionType: number) {
    const id = CommonUtils.generateRandomId();
    switch (questionType) {
      case 0:
        this.currentQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: this.defaultMultipleChoices(),
          answer: '',
          correctAnswer: '',
        };
        break;
      case 1:
        this.currentQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: [],
          answer: '',
          correctAnswer: '',
        };
        break;
      default:
        break;
    }
    this.data.questions.push({ ...this.currentQuestion });
    this.data = { ...this.data };
    this.mapQuestionEditting[id] = true;
  }

  removeQuestion(index: number) {
    this.data.questions.splice(index, 1);
  }

  onFileSelected(event: any) {
    if (this.data.audioName || this.data.audioName !== '') {
      this.deleteFile();
    }
    this.selectedFile = event.target.files[0] ?? null;
    this.uploadFile();
  }

  deleteFile() {
    const deleteSub = this.fileService
      .deleteFile(this.data.audioName)
      .subscribe();
    this.subscription.push(deleteSub);
  }

  uploadFile() {
    const uploadSub = this.fileService
      .uploadAudioFile(this.selectedFile)
      .subscribe((res) => {
        this.subscription.push(uploadSub);
        if (res) {
          this.data.audioName = res.fileName;
        }
      });
    this.subscription.push(uploadSub);
  }
}
