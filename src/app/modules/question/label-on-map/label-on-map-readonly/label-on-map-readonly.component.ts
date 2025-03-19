import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractReadonlyQuestionComponent } from '../../../../shared/abstract/abstract-readonly-question.component';
import { CHOICE_INDEX } from '../../../../utils/constant';

@Component({
  selector: 'app-label-on-map-readonly',
  standalone: true,
  imports: [MatIcon, ReactiveFormsModule],
  templateUrl: './label-on-map-readonly.component.html',
  styleUrl: '../label-on-map.component.scss',
})
export class LabelOnMapReadonlyComponent extends AbstractReadonlyQuestionComponent {
  choiceIndex = CHOICE_INDEX;
}
