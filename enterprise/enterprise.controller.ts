import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { Where } from 'src/common/where';

@Controller('admin/enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.enterpriseService.create(createCompanyDto);
    return {
      status: true,
      message: `Enterprise created successfully`,
      data: company,
    };
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get()
  async findAll(@Req() req) {
    const filter: Where = {};
    if (req.query.name) {
      filter.name = req.query.name;
    }
    if (req.query.country) {
      filter.country = req.query.country;
    }
    if (req.query.isBlocked) {
      filter.isBlock = req.query.isBlocked == 1;
    }
    const list = await this.enterpriseService.findAll(
      +req.query.limit,
      +req.query.offset,
      filter,
    );
    return {
      status: true,
      message: 'Enterprise listed successfully',
      data: list.list,
      total: list.total,
    };
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.enterpriseService.findOne(+id);
    return {
      status: true,
      message: 'Enterprise detailed successfully',
      data: data,
    };
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEnterpriseDto: UpdateEnterpriseDto,
  ) {
    console.log(updateEnterpriseDto);
    const update = await this.enterpriseService.update(
      +id,
      updateEnterpriseDto,
    );
    return {
      status: true,
      message: 'Enterprise updated successfully',
      data: [],
    };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.enterpriseService.remove(+id);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch('block')
  async blockEnterprise(@Req() req) {
    console.log(req.query);
    const data = await this.enterpriseService.blockEnterprise(+req.query.id);
    return {
      status: true,
      message:
        data.block === true
          ? `Enterprise blocked successfully`
          : `Enterprise unblocked successfully`,
      data: data,
    };
  }
}
