import { AbstractPart } from './abstract-part.model';
import { Choice } from './choice.model';

export interface Reading extends AbstractPart {
  _id?: string;
  name?: string;
  isMatchHeader?: boolean;
  answers?: Choice[];
}
