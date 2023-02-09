import { Test, TestingModule } from '@nestjs/testing';
import { SidesController } from './sides.controller';
import { SidesService } from './sides.service';

describe('SidesController', () => {
  let controller: SidesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SidesController],
      providers: [SidesService],
    }).compile();

    controller = module.get<SidesController>(SidesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
