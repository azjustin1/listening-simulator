import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listening',
  standalone: true,
  imports: [
    CommonModule,
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
  extends AbstractQuizPartComponent<Listening>
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @Output() onStartChange = new EventEmitter();

  audioUrl: string = '';
  selectedFile!: File;
  isDisableStartButton = false;

  subscription: Subscription[] = [];

  ngAfterViewInit(): void {
    this.getAudioFile(this.data.audioName!);
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

  override onStart() {
    super.onStart();
    this.isDisableStartButton = true;
    this.onStartChange.emit();
    // this.audioPlayer.nativeElement.play();
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
      this.deleteFile(this.data.audioName!);
    }
    this.selectedFile = event.target.files[0] ?? null;
    this.uploadFile();
  }

  deleteFile(fileName: string) {
    const deleteSub = this.fileService.deleteFile(fileName).subscribe();
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
