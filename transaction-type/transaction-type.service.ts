import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateTransactionTypeDto } from './dto/create-transaction-type.dto';
import { UpdateTransactionTypeDto } from './dto/update-transaction-type.dto';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma.service';
import { Where } from 'src/common/where';
import { GeneralService } from 'src/helpers/general/general.service';
import { models } from 'src/constants/contstant';

@Injectable()
export class TransactionTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly generalService: GeneralService,
  ) {}
  async create(createTransactionTypeDto: CreateTransactionTypeDto) {
    // try {
    createTransactionTypeDto.title = createTransactionTypeDto.title.trim();
    const slug = slugify(createTransactionTypeDto.title, {
      replacement: '_', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
    createTransactionTypeDto.slug = slug;
    const checkType = await this.prisma.transactionType.findFirst({
      where: {
        OR: [
          {
            title: {
              equals: createTransactionTypeDto.title,
              mode: 'insensitive',
            },
            slug: createTransactionTypeDto.slug,
          },
        ],
        AND: [
          {
            deletedAt: null,
          },
        ],
      },
    });
    if (checkType)
      throw new HttpException(
        'Transaction type already exist',
        HttpStatus.BAD_REQUEST,
      );

    const create = await this.prisma.transactionType.create({
      data: createTransactionTypeDto,
    });
    if (!create)
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    return {
      status: true,
      message: `Transaction type created successfully`,
      data: create,
    };
    // } catch (e) {
    //   throw new HttpException(
    //     e.meta.target[0] === 'slug'
    //       ? `Transaction type already exist`
    //       : 'something went wrong',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
  }

  async findAll(limit: number, offset: number, filter?: Where) {
    const where: Where = {
      deletedAt: null,
      NOT: [{ slug: 'other' }],
    };
    if (filter.name) {
      where.title = { contains: filter.name, mode: 'insensitive' };
    }

    console.log(filter.status);
    if (filter.status !== undefined) {
      console.log(filter.status);
      where.status = filter.status;
    }

    let list = await this.prisma.transactionType.findMany({
      where,
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        Question: {
          select: { id: true, question: true },
        },
      },
      take: limit,
      skip: offset,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });

    if (filter.ids !== undefined && filter.ids.length > 0) {
      list = await this.generalService.mergeAndSortList(
        list,
        filter.ids,
        models.transactionType,
      );
    }

    const count = await this.prisma.transactionType.findMany({
      where,
    });
    return {
      list,
      total: count.length,
    };
  }

  async findOne(id: number) {
    const data = await this.prisma.transactionType.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        Question: {
          select: {
            id: true,
            question: true,
            answer: {
              select: {
                id: true,
                answer: true,
                nextQuestion: {
                  select: {
                    question: true,
                  },
                },
                nextQuestionId: true,
              },
            },
          },
        },
      },
    });
    return {
      status: true,
      message: `Transaction types listed`,
      data,
    };
  }

  update(id: number, updateTransactionTypeDto: UpdateTransactionTypeDto) {
    updateTransactionTypeDto.title = updateTransactionTypeDto.title.trim();
    const slug = slugify(updateTransactionTypeDto.title, {
      replacement: '_', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
    return this.prisma.transactionType.update({
      where: { id: id },
      data: {
        title: updateTransactionTypeDto.title,
        description: updateTransactionTypeDto.description,
        slug: slug,
        baseQuestionId: updateTransactionTypeDto.baseQuestionId,
      },
    });
  }

  remove(id: number) {
    return this.prisma.transactionType.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async blockTransactionType(id: number): Promise<any> {
    console.log(id);
    const getType = await this.prisma.transactionType.findFirst({
      where: { id: id },
    });
    console.log(getType);
    if (getType.status) {
      return this.prisma.transactionType.update({
        where: { id: id },
        data: { status: false },
      });
    } else {
      return this.prisma.transactionType.update({
        where: { id: id },
        data: { status: true },
      });
    }
  }
}
