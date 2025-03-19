import { AbstractSection } from './abstract-section.model';
import { Choice } from './choice.model';

export interface Reading extends AbstractSection {
  answers?: Choice[];
  isMatchHeader?: boolean;
}
