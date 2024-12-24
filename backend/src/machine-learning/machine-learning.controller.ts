import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MachineLearningService } from './machine-learning.service';
import { UploadDataDto } from './dto/create-machine-learning.dto';
import { UpdateMachineLearningDto } from './dto/update-machine-learning.dto';

@Controller('machine-learning')
export class MachineLearningController {
  constructor(private readonly machineLearningService: MachineLearningService) { }

  @Post("upload")
  startMl(@Body() createMachineLearningDto: UploadDataDto) {
    console.log(createMachineLearningDto.file)
    return this.machineLearningService.applyML(createMachineLearningDto);
  }

  @Get("download-report")
  downloadReport() {
    return this.machineLearningService.downloadReport();
  }

}
