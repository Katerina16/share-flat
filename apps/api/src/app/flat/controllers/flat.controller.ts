import {
  Body,
  Controller, DefaultValuePipe, Delete,
  Get,
  Param, ParseArrayPipe, ParseBoolPipe,
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

  @Get('properties')
  findProperties(): Promise<PropertyEntity[]> {
    return this.flatService.findProperties();
  }

  @Get()
  find(
    @Req() req,
    @Query('shared', ParseBoolPipe) shared: boolean,
    @Query('city') cityId: number,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('guests', new DefaultValuePipe('1'), ParseIntPipe) guests: number,
    @Query('squareFrom') squareFrom?: number,
    @Query('squareTo') squareTo?: number,
    @Query('priceFrom') priceFrom?: number,
    @Query('priceTo') priceTo?: number,
    @Query('rooms') rooms?: number,
    @Query('properties', new ParseArrayPipe({ items: Number, separator: ',', optional: true })) properties?: number[],
    @Query('limit', new DefaultValuePipe('20'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
  ): Promise<{ count: number, flats: FlatEntity[] }> {
    return this.flatService.find({
      limit,
      offset,
      shared,
      cityId,
      from,
      to,
      guests,
      squareFrom,
      squareTo,
      priceFrom,
      priceTo,
      rooms,
      properties
    });
  }

  @UseGuards(JwtGuard)
  @Get('my')
  findMy(
    @Req() req,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('shared', ParseBoolPipe) shared: boolean,
  ): Promise<FlatEntity[]> {
    const { user: { id } } = req;
    return this.flatService.findMy(id, { shared, from, to });
  }


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
