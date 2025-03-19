import { Part } from "./part.model";

export interface AbstractSection {
  _id?: string;
  content: string;
  timeout: number | undefined;
  parts: Part[],
  quizId?: string;
}
