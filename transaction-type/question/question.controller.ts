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
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Where } from 'src/common/where';

@Controller('admin/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    console.log('aaaaa', createQuestionDto);
    return this.questionService.create(createQuestionDto);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    // console.log(updateQuestionDto);
    return this.questionService.update(+id, updateQuestionDto);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get()
  findAll(@Req() req) {
    const filter: Where = {};
    if (req.query.search) {
      filter.search = req.query.search;
    }

    if (req.query.transactiontype) {
      filter.id = +req.query.transactiontype;
    }
    if (req.query.ids) {
      filter.ids = req.query.ids.split(",").map( Number )
    }
    if (req.query.exclude) {
      filter.exclude = req.query.exclude.split(",").map( Number )
    }
    return this.questionService.findAll(
      +req.query.limit || 1000,
      +req.query.offset || 0,
      filter,
    );
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
