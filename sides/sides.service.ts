// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { Where } from 'src/common/where';
// import { PrismaService } from 'src/prisma.service';
// import { CreateSideDto } from './dto/create-side.dto';
// import { UpdateSideDto } from './dto/update-side.dto';

// @Injectable()
// export class SidesService {
//   constructor(private readonly prisma: PrismaService) {}
//   async create(createSideDto: CreateSideDto) {
//     try {
//       createSideDto.name = createSideDto.name.trim();
//       const get = await this.prisma.party.findFirst({
//         where: {
//           name: { equals: createSideDto.name, mode: 'insensitive' },
//           deletedAt: null,
//         },
//       });
//       if (get) {
//         throw new HttpException(
//           `This name is already in use`,
//           HttpStatus.BAD_REQUEST,
//         );
//       }
//       const create = await this.prisma.party.create({
//         data: { name: createSideDto.name },
//       });
//       return {
//         status: true,
//         message: `Side created successfully`,
//         data: create,
//       };
//     } catch (error) {
//       console.log(error);
//       throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
//     }
//   }


//   async findAll(limit: number, offset: number, filter: Where) {
//     const where: Where = {
//       deletedAt: null,
//     };
//     if (filter.name) {
//       where.name = { contains: filter.name, mode: 'insensitive' };
//     }


//     console.log(filter.status);
//     if (filter.status !== undefined) {
//       console.log(filter.status);
//       where.status = filter.status;
//     }
//     const list = await this.prisma.party.findMany({
//       where,
//       take: limit,
//       skip: offset,
//       orderBy: [
//         {
//           createdAt: 'desc',
//         },
//       ],
//     });
//     const count = await this.prisma.party.findMany({
//       where: {
//         deletedAt: null,
//       },
//     });
//     return {
//       status: true,
//       message: 'party listed successfully',
//       data: list,
//       total: count.length,
//     };
//   }

//   async findOne(id: number) {
//     const get = await this.prisma.party.findUnique({
//       where: { id: id },
//     });
//     return {
//       status: true,
//       message: `Side listed successfully`,
//       data: get,
//     };
//   }

//   async update(id: number, updateSideDto: UpdateSideDto) {
//     try {
//       const get = await this.prisma.party.findFirst({
//         where: { name: updateSideDto.name.trim(), deletedAt: null },
//       });
//       if (get)
//         throw new HttpException(
//           `This name already in use`,
//           HttpStatus.BAD_REQUEST,
//         );
//       const update = await this.prisma.party.update({
//         where: { id: id },
//         data: { name: updateSideDto.name.trim() },
//       });
//       return {
//         status: true,
//         message: `Side updated successfully`,
//         data: update,
//       };
//     } catch (error) {
//       throw new HttpException(error, HttpStatus.BAD_REQUEST);
//     }
//   }

//   async remove(id: number) {
//     try {
//       await this.prisma.party.update({
//         where: { id: id },
//         data: { deletedAt: new Date() },
//       });
//       return {
//         status: true,
//         message: `Side deleted successfully`,
//         data: [],
//       };
//     } catch (error) {
//       throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
//     }
//   }

//   async blockSide(id: number): Promise<any> {
//     console.log(id);
//     const getUser = await this.prisma.party.findFirst({ where: { id: id } });
//     console.log(getUser);
//     if (getUser.status) {
//       return this.prisma.party.update({
//         where: { id: id },
//         data: { status: false },
//       });
//     } else {
//       return this.prisma.party.update({
//         where: { id: id },
//         data: { status: true },
//       });
//     }
//   }
// }
