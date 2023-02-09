import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { AnswerDto } from './create-answer.dto';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateAnswerDto extends PartialType(AnswerDto) {
  id?: number;
  answer?: string;
  questionId?: number;
  nextQuestionId?: number;
}
