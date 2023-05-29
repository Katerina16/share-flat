import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../../guards/jwt.guard';
import { CreateReservationDto } from '@sf/interfaces/modules/flat/dto/create.reservation.dto';
import { ReservationService } from '../servises/reservation.service';
import { ReservationEntity } from '@sf/interfaces/modules/flat/entities/reservation.entity';
import { ConfirmReservationDto } from '@sf/interfaces/modules/flat/dto/confirm.reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtGuard)
  @Get()
  find(@Req() req, @Query('my', ParseBoolPipe) my: boolean): Promise<ReservationEntity[]> {
    const {
      user: { id },
    } = req;
    return this.reservationService.find(id, my);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findById(@Req() req, @Param('id', ParseIntPipe) id: number): Promise<ReservationEntity> {
    const {
      user: { id: userId },
    } = req;
    return this.reservationService.findById(id, userId);
  }

  @UseGuards(JwtGuard)
  @Post()
  reservation(@Req() req, @Body() reservation: CreateReservationDto): Promise<ReservationEntity> {
    const {
      user: { id },
    } = req;
    return this.reservationService.reservation(id, reservation);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  confirmReservation(
    @Req() req,
    @Param('id', ParseIntPipe) reservationId: number,
    @Body() confirmedDto: ConfirmReservationDto
  ): Promise<void> {
    const {
      user: { id },
    } = req;
    return this.reservationService.confirmReservation(id, reservationId, confirmedDto.confirmed);
  }
}
