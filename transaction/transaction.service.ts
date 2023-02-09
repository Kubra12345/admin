import { Injectable } from '@nestjs/common';
import { Where } from 'src/common/where';
import { PrismaService } from 'src/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class AdminTransactionService {
  constructor(private readonly prisma: PrismaService) {}
  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  async findAll(limit: number, offset: number, filter?: Where) {
    const where: Where = {
      deletedAt: null,
    };

    if (filter.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }

    if (filter.currentStatus) {
      where.currentStatus = filter.currentStatus;
    }
    const getUserSides = await this.prisma.transaction.findMany({
      skip: offset,
      take: limit,
      where,
      select: {
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
        currentStatus: true,
        transactionType: { select: { title: true, slug: true } },
        // sides: {
        //   select: {
        //     id: false,
        //     transactionId: false,
        //     sideId: false,
        //     side: { select: { name: true } },
        //     UserRole: {
        //       select: {
        //         id: false,
        //         transactionSideId: false,
        //         roleId: false,
        //         userId: false,
        //         users: {
        //           select: {
        //             email: true,
        //             firstName: true,
        //             lastName: true,
        //           },
        //         },
        //         role: { select: { name: true, slug: true } },
        //       },
        //     },
        //   },
        // },
      },
    });
    const count = await this.prisma.transaction.findMany({
      where,
    });
    const data = await Promise.all(
      getUserSides.map(async (o) => {
        const abc = {
          transactionName: o.name,
          transactionSlug: o.slug,
          status: o.currentStatus,
          // transactiontype: o.transactionType,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          // role: o.sides[0].UserRole[0].role,
          // user: o.sides[0].UserRole[0].users,
          // side: o.sides[0].side,
        };
        return abc;
      }),
    );
    console.log(data);
    return {
      status: true,
      messge: `Transactions listed successfully`,
      data: data,
      total: count.length,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
