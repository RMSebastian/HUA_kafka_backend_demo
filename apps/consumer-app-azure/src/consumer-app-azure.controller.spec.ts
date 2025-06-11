import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerAppAzureController } from './consumer-app-azure.controller';
import { ConsumerAppAzureService } from './consumer-app-azure.service';

describe('ConsumerAppAzureController', () => {
  let consumerAppAzureController: ConsumerAppAzureController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumerAppAzureController],
      providers: [ConsumerAppAzureService],
    }).compile();

    consumerAppAzureController = app.get<ConsumerAppAzureController>(ConsumerAppAzureController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consumerAppAzureController.getHello()).toBe('Hello World!');
    });
  });
});
