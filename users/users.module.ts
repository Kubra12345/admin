import { Module } from '@nestjs/common';
import { AdminUsersService } from './users.service';
import { AdminUsersController } from './users.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AdminUsersController],
  providers: [AdminUsersService, PrismaService],
  imports: [UsersModule],
})
export class AdminUsersModule {}
