import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { Where } from 'src/common/where';
import { PrismaService } from 'src/prisma.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

@Injectable()
export class AdminPartyService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPartyDto: CreatePartyDto) {
    try {
      const slug = slugify(createPartyDto.name.trim(), {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: 'vi', // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      });
      const get = await this.prisma.party.findFirst({
        where: {
          OR: [{ name: createPartyDto.name.trim() }, { slug: slug }],
          deletedAt: null,
        },
      });
      if (get) {
        throw new HttpException(
          `This name already in use`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const create = await this.prisma.party.create({
        data: { name: createPartyDto.name.trim(), slug: slug },
      });
      console.log(createPartyDto);
      await createPartyDto.permissions.map(async (o) => {
        const createPermission =
          await this.prisma.party_Permission_pivot.create({
            data: {
              partyId: create.id,
              permissionId: o,
            },
          });
      });
      return {
        status: true,
        message: `Party created successfully`,
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

    const list = await this.prisma.party.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    const count = await this.prisma.party.findMany({
      where,
    });
    return {
      status: true,
      message: 'Parties listed successfully',
      data: list,
      total: count.length,
    };
  }

  async findOne(id: number) {
    const get = await this.prisma.party.findUnique({
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
    return {
      status: true,
      message: `Party listed successfully`,
      data: data,
    };
  }

  async update(id: number, updatePartyDto: UpdatePartyDto) {
    try {
      const slug = slugify(updatePartyDto.name.trim(), {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: 'vi', // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      });
      const get = await this.prisma.party.findFirst({
        where: { OR: [{ name: updatePartyDto.name.trim() }, { slug: slug }] },
      });
      if (get && get.id !== id)
        throw new HttpException(
          `This name already in use`,
          HttpStatus.BAD_REQUEST,
        );
      const update = await this.prisma.party.update({
        where: { id: id },
        data: { name: updatePartyDto.name.trim(), slug: slug },
      });

      if (updatePartyDto.permissions) {
        await this.prisma.party_Permission_pivot.deleteMany({
          where: { partyId: id },
        });
        await updatePartyDto.permissions.map(async (o) => {
          const updatePermission =
            await this.prisma.party_Permission_pivot.create({
              data: {
                partyId: id,
                permissionId: o,
              },
            });
        });
      }
      return {
        status: true,
        message: `Party updated successfully`,
        data: update,
      };
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} party`;
  }

  async blockParty(id: number): Promise<any> {
    console.log(id);
    const getRole = await this.prisma.party.findFirst({ where: { id: id } });
    console.log(getRole);
    if (getRole.status) {
      await this.prisma.party.update({
        where: { id: id },
        data: { status: false },
      });
      return {
        status: true,
        message: `Party deactivated successfully`,
        data: [],
      };
    } else {
      await this.prisma.party.update({
        where: { id: id },
        data: { status: true },
      });
      return {
        status: true,
        message: `Party activated successfully`,
        data: [],
      };
    }
  }
}
