import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaService } from 'src/prisma.service';
import { GeneralService } from 'src/helpers/general/general.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, PrismaService, GeneralService],
  exports:[QuestionService]
})
export class QuestionModule {}
