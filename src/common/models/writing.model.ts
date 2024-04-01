import { AbstractPart } from './abstract-part.model';

export interface Writing extends AbstractPart {
  name?: string;
  answer: string;
}
