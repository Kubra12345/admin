import { Injectable } from '@nestjs/common';
import { Where } from 'src/common/where';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(limit: number, offset: number, filter?: Where) {
    return this.usersService.findAll(limit, offset, filter);
  }

  findOne(id: number) {
    return this.usersService.findOne(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async blockUser(id: number): Promise<any> {
    const block = await this.usersService.blockUser(id);
    if (block) return this.usersService.findOne(id);
  }
}
