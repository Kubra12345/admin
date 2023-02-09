// // import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// // import slugify from 'slugify';
// // import { Where } from 'src/common/where';
// // import { PrismaService } from 'src/prisma.service';

// // import { CreateRoleDto } from './dto/create-role.dto';
// // import { UpdateRoleDto } from './dto/update-role.dto';

// // @Injectable()
// // export class RolesService {
// //   constructor(private readonly prisma: PrismaService) {}
//   async create(createRoleDto: CreateRoleDto) {
//     try {
//       const slug = slugify(createRoleDto.name.trim(), {
//         replacement: '-', // replace spaces with replacement character, defaults to `-`
//         remove: undefined, // remove characters that match regex, defaults to `undefined`
//         lower: true, // convert to lower case, defaults to `false`
//         strict: false, // strip special characters except replacement, defaults to `false`
//         locale: 'vi', // language code of the locale to use
//         trim: true, // trim leading and trailing replacement chars, defaults to `true`
//       });
//       const get = await this.prisma.roles.findFirst({
//         where: {
//           OR: [{ name: createRoleDto.name.trim() }, { slug: slug }],
//           deletedAt: null,
//         },
//       });
//       if (get) {
//         throw new HttpException(
//           `This name already in use`,
//           HttpStatus.BAD_REQUEST,
//         );
//       }
//       const create = await this.prisma.roles.create({
//         data: { name: createRoleDto.name.trim(), slug: slug },
//       });
//       return {
//         status: true,
//         message: `Role created successfully`,
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

//     const list = await this.prisma.roles.findMany({
//       where,
//       take: limit,
//       skip: offset,
//       orderBy: [
//         {
//           createdAt: 'desc',
//         },
//       ],
//     });
//     const count = await this.prisma.roles.findMany({
//       where: {
//         deletedAt: null,
//       },
//     });
//     return {
//       status: true,
//       message: 'Roles listed successfully',
//       data: list,
//       total: count.length,
//     };
//   }

//   async findOne(id: number) {
//     const get = await this.prisma.par.findUnique({
//       where: { id: id },
//     });
//     return {
//       status: true,
//       message: `Role listed successfully`,
//       data: get,
//     };
//   }

// //   async update(id: number, updateRoleDto: UpdateRoleDto) {
// //     try {
// //       const slug = slugify(updateRoleDto.name.trim(), {
// //         replacement: '-', // replace spaces with replacement character, defaults to `-`
// //         remove: undefined, // remove characters that match regex, defaults to `undefined`
// //         lower: true, // convert to lower case, defaults to `false`
// //         strict: false, // strip special characters except replacement, defaults to `false`
// //         locale: 'vi', // language code of the locale to use
// //         trim: true, // trim leading and trailing replacement chars, defaults to `true`
// //       });
// //       const get = await this.prisma.roles.findFirst({
// //         where: { OR: [{ name: updateRoleDto.name.trim() }, { slug: slug }] },
// //       });
// //       if (get)
// //         throw new HttpException(
// //           `This name already in use`,
// //           HttpStatus.BAD_REQUEST,
// //         );
// //       const update = await this.prisma.roles.update({
// //         where: { id: id },
// //         data: { name: updateRoleDto.name.trim(), slug: slug },
// //       });
// //       return {
// //         status: true,
// //         message: `Role updated successfully`,
// //         data: update,
// //       };
// //     } catch (error) {
// //       throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
// //     }
// //   }

// //   async remove(id: number) {
// //     try {
// //       await this.prisma.roles.update({
// //         where: { id: id },
// //         data: { deletedAt: new Date() },
// //       });
// //       return {
// //         status: true,
// //         message: `Role deleted successfully`,
// //         data: [],
// //       };
// //     } catch (error) {
// //       throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
// //     }
// //   }

//   async blockRole(id: number): Promise<any> {
//     console.log(id);
//     const getRole = await this.prisma.roles.findFirst({ where: { id: id } });
//     console.log(getRole);
//     if (getRole.status) {
//       return this.prisma.roles.update({
//         where: { id: id },
//         data: { status: false },
//       });
//     } else {
//       return this.prisma.roles.update({
//         where: { id: id },
//         data: { status: true },
//       });
//     }
//   }
// }
