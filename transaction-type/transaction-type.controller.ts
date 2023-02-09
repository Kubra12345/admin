import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { CreateTransactionTypeDto } from './dto/create-transaction-type.dto';
import { UpdateTransactionTypeDto } from './dto/update-transaction-type.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { TransactionTypeService } from './transaction-type.service';
import { Where } from 'src/common/where';

@Controller('admin/transactiontype')
export class TransactionTypeController {
  constructor(
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post()
  create(@Body() createTransactionTypeDto: CreateTransactionTypeDto) {
    return this.transactionTypeService.create(createTransactionTypeDto);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get()
  async findAll(@Req() req) {
    const filter: Where = {};
    if (req.query.name) {
      filter.name = req.query.name;
    }

    if (req.query.status) {
      const status: boolean = req.query.status === 'true';
      filter.status = status;
    }
    if (req.query.ids) {
      filter.ids = req.query.ids.split(',').map(Number);
    }
    const list = await this.transactionTypeService.findAll(
      +req.query.limit,
      +req.query.offset,
      filter,
    );
    return {
      status: true,
      message: 'Transaction type listed successfully',
      data: list.list,
      total: list.total,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionTypeService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionTypeDto: UpdateTransactionTypeDto,
  ) {
    const updated = await this.transactionTypeService.update(
      +id,
      updateTransactionTypeDto,
    );
    return {
      status: true,
      message: 'Transaction type updated successfully',
      data: updated,
    };
  }

  @Put(':id')
  async remove(@Param('id') id: string) {
    // await this.transactionTypeService.remove(+id);
    // return {
    //   status: true,
    //   message: 'Transaction type Deleted successfully',
    //   data: [],
    // };
    const data = await this.transactionTypeService.blockTransactionType(+id);
    console.log(data);
    return {
      status: true,
      message:
        data.status === false
          ? `Type deactivated successfully`
          : `Type activated successfully`,
      data: data,
    };
  }
}
