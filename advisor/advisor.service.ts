import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { Where } from 'src/common/where';
import { PrismaService } from 'src/prisma.service';
import { CreateAdvisorDto } from './dto/create-advisor.dto';
import { UpdateAdvisorDto } from './dto/update-advisor.dto';

@Injectable()
export class AdminAdvisorService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAdvisorDto: CreateAdvisorDto) {
    try {
      const slug = slugify(createAdvisorDto.name.trim(), {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: 'vi', // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      });
      const get = await this.prisma.advisor.findFirst({
        where: {
          OR: [{ name: createAdvisorDto.name.trim() }, { slug: slug }],
          deletedAt: null,
        },
      });
      if (get) {
        throw new HttpException(
          `This name already in use`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const create = await this.prisma.advisor.create({
        data: { name: createAdvisorDto.name.trim(), slug: slug },
      });
      console.log(createAdvisorDto);
      await createAdvisorDto.permissions.map(async (o) => {
        const createPermission =
          await this.prisma.advisor_Permission_pivot.create({
            data: {
              advisorId: create.id,
              permissionId: o,
            },
          });
      });
      return {
        status: true,
        message: `Advisor created successfully`,
        data: create,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(limit: number, offset: number, filter: Where) {
    const where: Where = {
      deletedAt: null,
      NOT: [{ slug: 'other' }],
    };
    if (filter.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }

    console.log(filter.status);
    if (filter.status !== undefined) {
      console.log(filter.status);
      where.status = filter.status;
    }

    const list = await this.prisma.advisor.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    const count = await this.prisma.advisor.findMany({
      where,
    });
    return {
      status: true,
      message: 'Advisories listed successfully',
      data: list,
      total: count.length,
    };
  }

  async findOne(id: number) {
    const get = await this.prisma.advisor.findUnique({
      where: { id: id },
      include: {
        permissions: {
          select: {
            permission: { select: { key: true, id: true, description: true } },
          },
        },
      },
    });

    const permissionArr: number[] = [];
    const rolePermissionArr: any[] = [];
    await get.permissions.map((o) => {
      permissionArr.push(o.permission.id);
      rolePermissionArr.push(o.permission);
    });
    // delete get.permissions;
    const data = {
      ...get,
      permissions: permissionArr,
      rolePermissions: rolePermissionArr,
    };
    console.log(get);
    return {
      status: true,
      message: `Advisor listed successfully`,
      data: data,
    };
  }

  async update(id: number, updateAdvisorDto: UpdateAdvisorDto) {
    try {
      const slug = slugify(updateAdvisorDto.name.trim(), {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: 'vi', // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      });
      const get = await this.prisma.advisor.findFirst({
        where: { OR: [{ name: updateAdvisorDto.name.trim() }, { slug: slug }] },
      });
      if (get && get.id !== id)
        throw new HttpException(
          `This name already in use`,
          HttpStatus.BAD_REQUEST,
        );
      const update = await this.prisma.advisor.update({
        where: { id: id },
        data: { name: updateAdvisorDto.name.trim(), slug: slug },
      });

      if (updateAdvisorDto.permissions) {
        await this.prisma.advisor_Permission_pivot.deleteMany({
          where: { advisorId: id },
        });
        await updateAdvisorDto.permissions.map(async (o) => {
          const updatePermission =
            await this.prisma.advisor_Permission_pivot.create({
              data: {
                advisorId: id,
                permissionId: o,
              },
            });
        });
      }
      return {
        status: true,
        message: `Advisor updated successfully`,
        data: update,
      };
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} advisor`;
  }

  async blockAdvisor(id: number): Promise<any> {
    console.log(id);
    const getRole = await this.prisma.advisor.findFirst({ where: { id: id } });
    console.log(getRole);
    if (getRole.status) {
      await this.prisma.advisor.update({
        where: { id: id },
        data: { status: false },
      });
      return {
        status: true,
        message: `Advisory deactivated successfully`,
        data: [],
      };
    } else {
      await this.prisma.advisor.update({
        where: { id: id },
        data: { status: true },
      });
      return {
        status: true,
        message: `Advisory activated successfully`,
        data: [],
      };
    }
  }
}
