import { Module } from '@nestjs/common';
import { AdminPartyService } from './party.service';
import { AdminPartyController } from './party.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AdminPartyController],
  providers: [AdminPartyService, PrismaService],
})
export class PartyModuleAdmin {}
