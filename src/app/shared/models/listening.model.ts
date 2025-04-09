import { AbstractSection } from './abstract-section.model';
import { Part } from './part.model';

export interface Listening extends AbstractSection {
  audioTime?: number;
  audioName?: string;
  audioUrl?: string;
  parts: Part[];
}
