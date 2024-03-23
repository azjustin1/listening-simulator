import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
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
import { QuestionComponent } from '../question/question.component';
import { ListeningService } from './listening.service';

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
export class ListeningComponent extends AbstractQuizPartComponent<Listening> {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @Input() audioName: string = '';

  audioUrl: string = '';
  isDisableStartButton = false;

  subscription: Subscription[] = [];

  override ngOnInit(): void {
    super.ngOnInit();
    this.getAudioFile(this.audioName);
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
    this.audioPlayer.nativeElement.play();
    super.onStart();
  }
}
