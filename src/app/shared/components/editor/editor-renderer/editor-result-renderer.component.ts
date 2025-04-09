import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { OutputBlockData } from '@editorjs/editorjs';
import { CustomTextBlockPipe } from './custom-text.pipe';
import { NgClass } from '@angular/common';
import { ListBlockPipe } from './list-block.pipe';
import { TestService } from '../../../../pages/full-test/test.service';
import { FormsModule } from '@angular/forms';
import { Test } from '../../../models/test.model';

@Component({
  selector: 'app-editor-result-renderer',
  standalone: true,
  templateUrl: 'editor-result-renderer.component.html',
  imports: [CustomTextBlockPipe, ListBlockPipe, NgClass, FormsModule],
})
export class EditorResultRendererComponent implements OnInit {
  @Input() questionId = '';
  @Input() blocks: any[] = [];
  @Input() test!: Test;
  @Output() onValueChange = new EventEmitter();
  inputAnswer = [''];
  testService = inject(TestService);

  ngOnInit() {
    this.inputAnswer = this.testService.getQuestionAnswer(this.questionId);
  }

  onSelectAnswer($event: Event, answer: string) {
    const isChecked = (<HTMLInputElement>$event.target).checked;
    this.onValueChange.emit(isChecked ? answer : '');
  }

  onEnterAnswer(answer: string) {
    this.onValueChange.emit(answer);
  }
}
