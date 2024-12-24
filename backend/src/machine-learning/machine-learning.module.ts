import { Module } from '@nestjs/common';
import { MachineLearningService } from './machine-learning.service';
import { MachineLearningController } from './machine-learning.controller';

@Module({
  controllers: [MachineLearningController],
  providers: [MachineLearningService],
})
export class MachineLearningModule {}
