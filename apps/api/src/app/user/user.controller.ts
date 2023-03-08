import {Body, Controller, Get, Post, Put, Req, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "@sf/interfaces/modules/user/dto/create.user.dto";
import {JwtGuard} from "../../guards/jwt.guard";
import {UpdateUserDto} from "@sf/interfaces/modules/user/dto/update.user.dto";


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @UseGuards(JwtGuard)
  @Get('current')
  getUserById(@Req() req) {
    const { user } = req;

    return this.userService.getUserById(user.id);
  }

  @UseGuards(JwtGuard)
  @Put()
  updateUser(@Body() body: UpdateUserDto, @Req() req) {
    const { user } = req;

    return this.userService.update(user.id, body);
  }
}
