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
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Listening } from '../../common/models/listening.model';
import { CommonUtils } from '../../utils/common-utils';
import { FileService } from '../file.service';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { ListeningService } from './listening.service';

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
export class ListeningComponent implements AfterViewInit, OnDestroy {
  @Input() data: Listening = {
    name: '',
    questions: [],
    audioName: '',
  };
  @Input() isTesting: boolean = false;
  @Input() isEditting: boolean = false;
  @Input() isReadOnly: boolean = false;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;

  audioUrl: string = '';

  selectedFile!: File;
  currentQuiz: any = {
    name: '',
    timeout: null,
    questions: [],
  };
  currentQuestion: any = {
    content: '',
    description: '',
    type: null,
    choices: [],
  };

  subscription: Subscription[] = [];

  constructor(private fileService: FileService) {}

  ngAfterViewInit(): void {
    console.log('After view init', this.audioPlayer);
    this.getAudioFile(this.data.audioName);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getAudioFile(fileName: string) {
    this.fileService.getFile(fileName).subscribe((audioFile: Blob) => {
      const fileURL = URL.createObjectURL(audioFile);
      const audioElement: HTMLAudioElement = this.audioPlayer.nativeElement;
      this.audioUrl = fileURL;
      audioElement.load();
    });
  }

  addQuestion(questionType: number) {
    switch (questionType) {
      case 0:
        this.currentQuestion = {
          id: CommonUtils.generateRandomId(),
          content: '',
          type: questionType,
          choices: this.defaultMultipleChoices(),
        };
        break;
      case 1:
        this.currentQuestion = {
          id: CommonUtils.generateRandomId(),
          content: '',
          type: questionType,
          choices: [],
        };
        break;
      default:
        break;
    }
    this.data.questions.push({ ...this.currentQuestion });
    this.data = { ...this.data };
  }

  defaultMultipleChoices() {
    const choices = [];
    for (let i = 0; i < 4; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  defaultShortAnswerChoices() {
    const choices = [];
    for (let i = 0; i < 4; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
        index: '',
      };
      choices.push(choice);
    }
    return choices;
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
