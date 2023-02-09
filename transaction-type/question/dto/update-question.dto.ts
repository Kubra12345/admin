import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { AnswerDto } from './create-answer.dto';
import { CreateQuestionDto } from './create-question.dto';
import { UpdateAnswerDto } from './update-answer.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  transactionTypeId?: [];

  question?: string;

  @ValidateNested()
  @Type(() => UpdateAnswerDto)
  updatedAnswer?: UpdateAnswerDto[];

  deletedAnswer?: [];

  @ValidateNested()
  @Type(() => AnswerDto)
  createdAnswer?: AnswerDto[];
}
