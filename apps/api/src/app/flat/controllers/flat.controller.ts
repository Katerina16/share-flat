import {
  Body,
  Controller, DefaultValuePipe, Delete,
  Get,
  Param, ParseBoolPipe,
  ParseIntPipe,
  Post, Put, Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FlatService } from "../servises/flat.service";
import { JwtGuard } from "../../../guards/jwt.guard";
import { CreateFlatDto } from "@sf/interfaces/modules/flat/dto/create.flat.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FlatEntity } from "@sf/interfaces/modules/flat/entities/flat.entity";
import { PropertyEntity } from "@sf/interfaces/modules/flat/entities/property.entity";

@Controller('flat')
export class FlatController {
  constructor(private readonly flatService: FlatService) {
  }

  @UseGuards(JwtGuard)
  @Get('properties')
  findProperties(): Promise<PropertyEntity[]> {
    return this.flatService.findProperties();
  }

  @UseGuards(JwtGuard)
  @Get()
  find(
    @Query('shared', ParseBoolPipe) shared: boolean,
    @Query('city') cityId: number,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('guests', new DefaultValuePipe('1'), ParseIntPipe) guests: number,
  ): Promise<FlatEntity[]> {

    return this.flatService.find({ shared, cityId, from, to, guests });
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
  @Put(':id')
  update(@Req() req, @Param('id', ParseIntPipe) flatId: number, @Body() flat: CreateFlatDto): Promise<FlatEntity> {
    const { user: { id } } = req;
    return this.flatService.update(id, flatId, flat);
  }

  @UseGuards(JwtGuard)
  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('file'))
  addPhoto(@Param('id', ParseIntPipe) flatId: number, @UploadedFile() file): Promise<void> {
    return this.flatService.addPhoto(flatId, file);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/photo/:photo')
  deletePhoto(@Req() req, @Param('id', ParseIntPipe) flatId: number, @Param('photo') photo: string): Promise<void> {
    const { user: { id } } = req;
    return this.flatService.deletePhoto(id, flatId, photo);
  }
}
