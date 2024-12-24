import { PartialType } from '@nestjs/mapped-types';
import { UploadDataDto } from './create-machine-learning.dto';

export class UpdateMachineLearningDto extends PartialType(UploadDataDto) { }
