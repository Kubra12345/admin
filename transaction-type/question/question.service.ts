import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Where } from 'src/common/where';
import { models } from 'src/constants/contstant';
import { GeneralService } from 'src/helpers/general/general.service';
import { PrismaService } from 'src/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService,private readonly generalService: GeneralService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    try {
      console.log(createQuestionDto.transactionTypeId.length);
      const createQuestion = await this.prisma.question.create({
        data: {
          question: createQuestionDto.question,
        },
      });
      if (!createQuestion)
        throw new HttpException(
          'Something went wrong on creating question',
          HttpStatus.BAD_REQUEST,
        );
      const relatioship = await createQuestionDto.transactionTypeId.map((o) => {
        return {
          questionId: createQuestion.id,
          transactionTypeId: o,
        };
      });
      console.log(relatioship);
      // insert TranstionTypes
      const createRelationWithTransactionType =
        await this.prisma.transactionType_Question_pivot.createMany({
          data: relatioship,
        });
      console.log(createRelationWithTransactionType);
      const answerData = await createQuestionDto.answer.map((o) => {
        return {
          answer: o.answer,
          questionId: createQuestion.id,
          nextQuestionId: o.nextQuestionId,
        };
      });
      console.log(answerData);
      const createRelationWithAnswer = await this.prisma.answer.createMany({
        data: answerData,
      });
      return {
        status: true,
        message: `Question created successfully`,
        data: [],
      };
    } catch (e) {
      console.log(e.response);
    }
  }

  async findAll(limit: number, offset: number, filter?: Where) {
    const where: Where = { deletedAt: null };
    if (filter.search) {
      where.question = { contains: filter.search, mode: 'insensitive' };
    }

    if (filter.id) {
      where.Transactiontypepivot = { some: { transactionTypeId: filter.id } };
    }
    if (filter.exclude) {
      where.id = { notIn: filter.exclude };
    }
    console.log(where);
    let get = await this.prisma.question.findMany({
      where,
      select: {
        question: true,
        id: true,
        answer: { where: { deletedAt:null } },
        createdAt: true,         
        Transactiontypepivot: {select:{transactionType:{select:{id:true,title:true}}}},        
      },
      orderBy: { question: 'asc' },
      skip: offset,
      take: limit,
    });
    if (filter.ids !== undefined && filter.ids.length > 0) {            
      get = await this.generalService.mergeAndSortList(get,filter.ids,models.question)
    }
    const count = await this.prisma.question.count({
      where,
    });
    const data = await get.map((o) => {
      let transactionType = o.Transactiontypepivot.map((t)=>{return {id:t.transactionType?.id,title:t.transactionType?.title}})
      return {
        id: o.id,
        question: o.question,
        answer: o.answer.length,
        createdAt: o.createdAt,        
        transactionType,
        Transactiontypepivot:o.Transactiontypepivot
      };
    });
    return {
      status: true,
      message: 'Questions listed successfully',
      data: data,
      total: count,
    };
  }

  async findOne(id: number) {
    const get = await this.prisma.question.findUnique({
      where: { id: id },
      select: {
        question: true,
        id: true,
        answer: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
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
        Transactiontypepivot: {
          select: {
            transactionType: {
              select: {
                title: true,
                id: true,
              },
            },
          },
        },
      },
    });
    const arr: number[] = [];
    const data = {
      id: get.id,
      question: get.question,
      answer: get.answer,
      transactionType: get.Transactiontypepivot.map((o) => {
        arr.push(o.transactionType.id);
        return {
          id: o.transactionType.id,
          title: o.transactionType.title,
        };
      }),
      transactionTypeId: arr,
    };
    return {
      status: true,
      message: `Question listed`,
      data: data,
    };
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    console.log(updateQuestionDto.deletedAnswer);
    try {
      console.log(updateQuestionDto.transactionTypeId.length);
      const updateQuestion = await this.prisma.question.update({
        where: { id: id },
        data: {
          question: updateQuestionDto.question,
        },
      });
      if (!updateQuestion)
        throw new HttpException(
          'Something went wrong on updating question',
          HttpStatus.BAD_REQUEST,
        );
      const relatioship = await updateQuestionDto.transactionTypeId.map((o) => {
        return {
          questionId: id,
          transactionTypeId: o,
        };
      });
      // // // delete relations between question and transactionType
      await this.prisma.transactionType_Question_pivot.deleteMany({
        where: { questionId: id },
      });
      // // insert TranstionTypes
      const createRelationWithTransactionType =
        await this.prisma.transactionType_Question_pivot.createMany({
          data: relatioship,
        });
      // const createAnswerData = await this.prisma.answer.createMany({
      //   data: updateQuestionDto.createdAnswer,
      // });
      const createAnswerData = await updateQuestionDto.createdAnswer.map(
        async (o) => {
          await this.prisma.answer.createMany({
            data: {
              answer: o.answer,
              questionId: id,
              nextQuestionId: o.nextQuestionId || null,
            },
          });
        },
      );

      const deleteAnswerData = await this.prisma.answer.updateMany({
        data: { deletedAt: new Date() },
        where: { id: { in: updateQuestionDto.deletedAnswer } },
      });
      const updateAnswerData = await updateQuestionDto.updatedAnswer.map(
        async (o) => {
          await this.prisma.answer.update({
            where: { id: o.id },
            data: {
              answer: o.answer,
              questionId: id,
              nextQuestionId: o.nextQuestionId || null,
            },
          });
        },
      );

      return {
        status: true,
        message: `Question updated successfully`,
        data: [],
      };
    } catch (e) {
      console.log(e);
    }
    // return `This action updates a #${id} question`;
  }

  async remove(id: number) {
    await this.prisma.question.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });

    await this.prisma.answer.updateMany({
      where: { questionId: id },
      data: {
        deletedAt: new Date(),
      },
    });

    await this.prisma.transactionType_Question_pivot.deleteMany({
      where: { questionId: id },
    });

    return {
      status: true,
      message: 'Question deleted successfully',
      data: [],
    };
  }
}
