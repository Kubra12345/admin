import { Module } from '@nestjs/common';
import { AdminAdvisorService } from './advisor.service';
import { AdminAdvisorController } from './advisor.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AdminAdvisorController],
  providers: [AdminAdvisorService, PrismaService],
})
export class AdvisorModuleAdmin {}
