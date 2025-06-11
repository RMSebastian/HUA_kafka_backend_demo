import { Test, TestingModule } from '@nestjs/testing';
import { ProducerAppAzureController } from './producer-app-azure.controller';
import { ProducerAppAzureService } from './producer-app-azure.service';

describe('ProducerAppAzureController', () => {
  let producerAppAzureController: ProducerAppAzureController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProducerAppAzureController],
      providers: [ProducerAppAzureService],
    }).compile();

    producerAppAzureController = app.get<ProducerAppAzureController>(ProducerAppAzureController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(producerAppAzureController.getHello()).toBe('Hello World!');
    });
  });
});
