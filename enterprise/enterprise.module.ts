import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { PrismaService } from 'src/prisma.service';
import { CompanyService } from 'src/company/company.service';
import { PrismaClient } from '@prisma/client';
import { AddressService } from 'src/company/address/address.service';

@Module({
  controllers: [EnterpriseController],
  providers: [
    EnterpriseService,
    PrismaClient,
    PrismaService,
    CompanyService,
    AddressService,
  ],
})
export class EnterpriseModule {}
