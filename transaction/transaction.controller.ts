import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminTransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionService } from 'src/users/transaction/transaction.service';
import { Where } from 'src/common/where';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('admin/transaction')
export class AdminTransactionController {
  constructor(
    private readonly adminTransactionService: AdminTransactionService,
    private readonly transactionService: TransactionService,
  ) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get()
  findAll(@Req() req) {
    const filter: Where = {};
    if (req.query.status) {
      filter.currentStatus = req.query.status;
    }

    if (req.query.name) {
      filter.name = req.query.name;
    }
    return this.adminTransactionService.findAll(
      +req.query.limit,
      +req.query.offset,
      filter,
    );
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.adminTransactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminTransactionService.remove(+id);
  }
}
