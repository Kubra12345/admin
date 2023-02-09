import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  async signin(data: AuthDto) {
    // Check if user exists
    const user = await this.usersService.findByEmail(data.email);
    if (!user)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    // if (user.isActive !== 'active')
    //   throw new BadRequestException('You are not active yet');
    if (user.isSuperAdmin === false)
      throw new HttpException('invalid Credential', HttpStatus.BAD_REQUEST);
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    const tokens = await this.authService.getTokens(
      user.id,
      user.email,
      user.companyId,
      user.isAdmin
    );
    await this.usersService.verifyUser(user.id);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
    delete user.password;
    delete user.refreshToken;
    return { ...user, ...tokens };
  }
}
