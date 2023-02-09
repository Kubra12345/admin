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
import { AdminPartyService } from './party.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { Where } from 'src/common/where';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('admin/party')
export class AdminPartyController {
  constructor(private readonly partyService: AdminPartyService) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post()
  create(@Body() createPartyDto: CreatePartyDto) {
    return this.partyService.create(createPartyDto);
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
    return this.partyService.findAll(
      +req.query.limit,
      +req.query.offset,
      filter,
    );
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partyService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartyDto: UpdatePartyDto) {
    return this.partyService.update(+id, updatePartyDto);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Put(':id')
  remove(@Param('id') id: string) {
    return this.partyService.blockParty(+id);
  }
}
