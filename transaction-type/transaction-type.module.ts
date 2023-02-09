import { Module } from '@nestjs/common';
import { TransactionTypeService } from './transaction-type.service';
import { TransactionTypeController } from './transaction-type.controller';
import { PrismaService } from 'src/prisma.service';
import { QuestionModule } from './question/question.module';
import { GeneralService } from 'src/helpers/general/general.service';

@Module({
  controllers: [TransactionTypeController],
  providers: [TransactionTypeService, PrismaService, GeneralService],
  imports: [QuestionModule],
  exports:[TransactionTypeService]
})
export class TransactionTypeModule {}
