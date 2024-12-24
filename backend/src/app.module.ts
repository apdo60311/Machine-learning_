import { Module } from '@nestjs/common';
import { MachineLearningModule } from './machine-learning/machine-learning.module';

@Module({
  imports: [MachineLearningModule],
})
export class AppModule { }
