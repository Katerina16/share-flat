import {Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "@sf/interfaces/modules/user/dto/create.user.dto";
import {JwtGuard} from "../../guards/jwt.guard";


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id) {
    return this.userService.getUserById(id);
  }
}
