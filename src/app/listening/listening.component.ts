import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { AbstractQuizPartComponent } from '../../common/abstract-quiz-part.component';
import { Listening } from '../../common/models/listening.model';
import { FileService } from '../file.service';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { ListeningService } from './listening.service';
import { QuestionComponent } from '../question/question.component';

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
    QuestionComponent,
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
