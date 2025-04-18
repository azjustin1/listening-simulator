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
import { CheckboxBlockPipe } from "./checkbox-block.pipe";

@Component({
  selector: 'app-editor-testing-renderer',
  standalone: true,
  templateUrl: 'editor-testing-renderer.component.html',
  imports: [
    CustomTextBlockPipe,
    ListBlockPipe,
    NgClass,
    FormsModule,
    CheckboxBlockPipe,
  ],
})
export class EditorTestingRendererComponent implements OnInit {
  @Input() questionId = '';
  @Input() blocks: any[] = [];
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
