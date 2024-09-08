export interface Choice {
  _id?: string;
  id: string;
  content: string;
  index?: string;
  order: number;
  answer?: string;
  correctAnswer?: string;
}
