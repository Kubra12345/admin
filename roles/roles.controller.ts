// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Req,
//   UseGuards,
//   Put,
// } from '@nestjs/common';
// import { RolesService } from './roles.service';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
// import { Where } from 'src/common/where';
// import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
// import { AdminGuard } from 'src/common/guards/admin.guard';

// @Controller('admin/roles')
// export class RolesController {
//   constructor(private readonly rolesService: RolesService) {}

//   @UseGuards(AccessTokenGuard, AdminGuard)
//   @Post()
//   create(@Body() createRoleDto: CreateRoleDto) {
//     return this.rolesService.create(createRoleDto);
//   }

//   @UseGuards(AccessTokenGuard, AdminGuard)
//   @Get()
//   findAll(@Req() req) {
//     const filter: Where = {};
//     if (req.query.name) {
//       filter.name = req.query.name;
//     }
//     if (req.query.status) {
//       const status: boolean = req.query.status === 'true';
//       filter.status = status;
//     }
//     return this.rolesService.findAll(
//       +req.query.limit,
//       +req.query.offset,
//       filter,
//     );
//   }

//   @UseGuards(AccessTokenGuard, AdminGuard)
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.rolesService.findOne(+id);
//   }

//   @UseGuards(AccessTokenGuard, AdminGuard)
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
//     return this.rolesService.update(+id, updateRoleDto);
//   }

//   @UseGuards(AccessTokenGuard, AdminGuard)
//   @Put(':id')
//   async remove(@Param('id') id: string) {
//     // return this.rolesService.remove(+id);
//     const data = await this.rolesService.blockRole(+id);
//     console.log(data);
//     return {
//       status: true,
//       message:
//         data.status === false
//           ? `Role deactivated successfully`
//           : `Role activated successfully`,
//       data: data,
//     };
//   }
// }
