import { AbstractPart } from './abstract-part.model';
import { Choice } from './choice.model';

export interface Reading extends AbstractPart {
  answers?: Choice[];
  name: string;
}
