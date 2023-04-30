import {Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards} from '@nestjs/common';
import {FlatService} from "../servises/flat.service";
import {JwtGuard} from "../../../guards/jwt.guard";
import {CreateFlatDto} from "@sf/interfaces/modules/flat/dto/create.flat.dto";


@Controller('flat')
export class FlatController {
  constructor(private readonly flatService: FlatService) {
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.flatService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() flat: CreateFlatDto) {
    const { user: { id } } = req;
    return this.flatService.create(id, flat);
  }
}
