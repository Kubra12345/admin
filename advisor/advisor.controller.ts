import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Where } from 'src/common/where';
import { AdminAdvisorService } from './advisor.service';
import { CreateAdvisorDto } from './dto/create-advisor.dto';
import { UpdateAdvisorDto } from './dto/update-advisor.dto';

@Controller('admin/advisor')
export class AdminAdvisorController {
  constructor(private readonly advisorService: AdminAdvisorService) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post()
  create(@Body() createAdvisorDto: CreateAdvisorDto) {
    return this.advisorService.create(createAdvisorDto);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get()
  findAll(@Req() req) {
    const filter: Where = {};
    if (req.query.name) {
      filter.name = req.query.name;
    }
    if (req.query.status) {
      const status: boolean = req.query.status === 'true';
      filter.status = status;
    }
    return this.advisorService.findAll(
      +req.query.limit,
      +req.query.offset,
      filter,
    );
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advisorService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdvisorDto: UpdateAdvisorDto) {
    return this.advisorService.update(+id, updateAdvisorDto);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Put(':id')
  remove(@Param('id') id: string) {
    return this.advisorService.blockAdvisor(+id);
  }
}
