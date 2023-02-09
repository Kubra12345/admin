import { Module } from '@nestjs/common';
import { AdminPermissionService } from './permission.service';
import { AdminPermissionController } from './permission.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AdminPermissionController],
  providers: [AdminPermissionService, PrismaService],
})
export class PermissionModuleAdmin {}
