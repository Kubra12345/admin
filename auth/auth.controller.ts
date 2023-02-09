import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { AdminAuthService } from './auth.service';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('signin')
  async signin(@Body() data: AuthDto) {
    const user = await this.authService.signin(data);
    return {
      status: true,
      message: 'logged in successfully',
      data: user,
    };
  }
}
