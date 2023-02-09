import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { AnswerDto } from './create-answer.dto';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  transactionTypeId: [];

  @IsNotEmpty()
  question: string;

  @ValidateNested()
  @Type(() => AnswerDto)
  answer: AnswerDto[];
}
