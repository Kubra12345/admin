import { IsNotEmpty } from 'class-validator';

export class AnswerDto {
  @IsNotEmpty()
  answer: string;
  questionId: number;
  nextQuestionId?: number;
}
