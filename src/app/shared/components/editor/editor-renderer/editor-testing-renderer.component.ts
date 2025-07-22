import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { TestService } from '../../../../pages/full-test/test.service';
import { FormsModule } from '@angular/forms';

interface Block {
  type: string;
  questionId: string;
  data: any[];
  selectedValue?: string; // For selectOne and dropdown
}

interface AnswerEmission {
  questionId: string;
  answers: any[];
}

@Component({
  selector: 'app-editor-testing-renderer',
  standalone: true,
  templateUrl: 'editor-testing-renderer.component.html',
  imports: [NgClass, FormsModule],
})
export class EditorTestingRendererComponent implements OnInit {
  @Input() questionId = '';
  @Input() blocks: any[] = [];
  @Output() onValueChange = new EventEmitter();
  @Output() valueChanged = new EventEmitter<AnswerEmission>();
  inputAnswer = [''];
  testService = inject(TestService);

  ngOnInit() {
    this.inputAnswer = this.testService.getQuestionAnswer(this.questionId);
  }

  // Short Answer: Emit array of input values
  updateShortAnswerValue(questionId: string, data: any[]) {
    const answers = data
      .filter((item) => item.type === 'input' && item.value)
      .map((item) => item.value);
    this.valueChanged.emit({ questionId: this.questionId, answers: answers });
    console.log('Emitted:', { questionId: this.questionId, answers: answers });
  }

  // Select Multiple: Emit array of selected options
  updateSelectMultipleValue(options: any[]) {
    const answers = options
      .filter((option) => option.checked)
      .map((option) => option.value);
    this.valueChanged.emit({ questionId: this.questionId, answers: answers });
    console.log('Emitted:', { questionId: this.questionId, answers: answers });
  }

  // Select One: Emit single value as array
  updateSelectOneValue(value: string) {
    const answers = value ? [value] : [];
    this.valueChanged.emit({ questionId: this.questionId, answers: answers });
    console.log('Emitted:', { questionId: this.questionId, answers: answers });
  }

  // Dropdown: Emit single value as array
  updateDropdownValue(value: string) {
    const answers = value ? [value] : [];
    this.valueChanged.emit({ questionId: this.questionId, answers: answers });
    console.log('Emitted:', { questionId: this.questionId, answers: answers });
  }
}
