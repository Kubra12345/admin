import { Module } from '@nestjs/common';
import { AdminTransactionService } from './transaction.service';
import { AdminTransactionController } from './transaction.controller';
import { TransactionService } from 'src/users/transaction/transaction.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AdminTransactionController],
  providers: [AdminTransactionService, TransactionService, PrismaService],
})
export class TransactionModule {}
