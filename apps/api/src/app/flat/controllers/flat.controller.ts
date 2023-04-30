import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {FlatService} from "../servises/flat.service";
import {JwtGuard} from "../../../guards/jwt.guard";
import {CreateFlatDto} from "@sf/interfaces/modules/flat/dto/create.flat.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {FlatEntity} from "@sf/interfaces/modules/flat/entities/flat.entity";

@Controller('flat')
export class FlatController {
  constructor(private readonly flatService: FlatService) {
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<FlatEntity> {
    return this.flatService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() flat: CreateFlatDto): Promise<FlatEntity> {
    const { user: { id } } = req;
    return this.flatService.create(id, flat);
  }

  @UseGuards(JwtGuard)
  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('file'))
  pinPhoto(@Req() req, @Param('id', ParseIntPipe) flatId: number, @UploadedFile() file: Express.Multer.File) {
    console.log(file)
    const { user: { id } } = req;
    console.log(id, flatId)
    // return this.flatService.create(id, flat);

  }
}
