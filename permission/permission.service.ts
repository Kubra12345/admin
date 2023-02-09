import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class AdminPermissionService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPermissionDto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: {
        description: createPermissionDto.description,
        key: createPermissionDto.action,
      },
    });
  }

  async findAll() {
    const permissions = await this.prisma.permission.findMany({});
    return {
      status: true,
      message: `permissions listed successfuly`,
      data: permissions,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
