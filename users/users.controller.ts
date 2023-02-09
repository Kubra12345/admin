import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminUsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Where } from 'src/common/where';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(AccessTokenGuard)
  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get()
  async findAll(@Req() req) {
    const filter: Where = {};
    if (req.query.name) {
      filter.name = req.query.name;
    }
    if (req.query.email) {
      filter.email = req.query.email;
    }
    if (req.query.company) {
      filter.companyId = parseInt(req.query.company);
    }
    if (req.query.isActive) {
      filter.isActive = req.query.isActive == 1;
    }
    if (req.query.isBlocked) {
      filter.isBlock = req.query.isBlocked == 1;
    }
    const users = await this.usersService.findAll(
      +req.query.limit,
      +req.query.offset,
      filter,
    );
    console.log(users);
    return {
      status: true,
      message: `User listed successfully`,
      total: users.total,
      data: users.user,
    };
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(id);
    const user = await this.usersService.findOne(+id);
    return {
      status: true,
      message: `user detailed data`,
      data: user,
    };
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Put('block')
  async blockUser(@Req() req) {
    const data = await this.usersService.blockUser(+req.query.id);
    console.log(data);
    return {
      status: true,
      message:
        data.isBlock === true
          ? `User blocked successfully`
          : `User unblocked successfully`,
      data: data,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
