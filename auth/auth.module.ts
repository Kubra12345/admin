import { Module } from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { AdminAuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AdminAuthController],
  providers: [AdminAuthService, PrismaService],
  imports: [UsersModule, AuthModule],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
