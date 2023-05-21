import {  Body,  Controller, Get, Param, ParseIntPipe,  Post,  Req,  UseGuards,} from '@nestjs/common';import { JwtGuard } from "../../../guards/jwt.guard";import { MessageService } from "../servises/message.service";import { CreateMessageDto } from "@sf/interfaces/modules/flat/dto/create.message.dto";import { MessageEntity } from "@sf/interfaces/modules/flat/entities/message.entity";@Controller('message')export class MessageController {  constructor(private readonly messageService: MessageService) {  }  @UseGuards(JwtGuard)  @Get(':id')  find(@Param('id', ParseIntPipe) reservationId: number): Promise<MessageEntity[]> {    return this.messageService.find(reservationId);  }  @UseGuards(JwtGuard)  @Post()  create(@Req() req, @Body() message: CreateMessageDto): Promise<MessageEntity> {    const { user: { id } } = req;    return this.messageService.create(id, message);  }}