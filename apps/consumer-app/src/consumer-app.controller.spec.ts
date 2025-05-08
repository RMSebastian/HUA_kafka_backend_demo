import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerAppController } from './consumer-app.controller';
import { ConsumerAppService } from './consumer-app.service';

describe('ConsumerAppController', () => {
  let consumerAppController: ConsumerAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumerAppController],
      providers: [ConsumerAppService],
    }).compile();

    consumerAppController = app.get<ConsumerAppController>(
      ConsumerAppController,
    );
  });
});
