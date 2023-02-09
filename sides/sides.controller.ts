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
// import { SidesService } from './sides.service';
// import { CreateSideDto } from './dto/create-side.dto';
// import { UpdateSideDto } from './dto/update-side.dto';
// import { Where } from 'src/common/where';
// import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
// import { AdminGuard } from 'src/common/guards/admin.guard';

// @Controller('admin/sides')
// export class SidesController {
//   constructor(private readonly sidesService: SidesService) {}
//   @UseGuards(AccessTokenGuard, AdminGuard)
//   @Post()
//   create(@Body() createSideDto: CreateSideDto) {
//     return this.sidesService.create(createSideDto);
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
//     return this.sidesService.findAll(
//       +req.query.limit,
//       +req.query.offset,
//       filter,
//     );
//   }

//   @UseGuards(AccessTokenGuard, AdminGuard)
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.sidesService.findOne(+id);
//   }

//   @UseGuards(AccessTokenGuard, AdminGuard)
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateSideDto: UpdateSideDto) {
//     return this.sidesService.update(+id, updateSideDto);
//   }

//   @UseGuards(AccessTokenGuard, AdminGuard)
//   @Put(':id')
//   async remove(@Param('id') id: string) {
//     // return this.sidesService.remove(+id);
//     const data = await this.sidesService.blockSide(+id);
//     console.log(data);
//     return {
//       status: true,
//       message:
//         data.status === false
//           ? `Side deactivated successfully`
//           : `Side activated successfully`,
//       data: data,
//     };
//   }
// }
