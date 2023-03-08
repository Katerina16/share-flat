import {Body, Controller, Post, Request} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "@sf/interfaces/modules/user/dto/create.user.dto";


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('test')
  async test(@Request() req) {
    console.log(req)
    return true;
  }
}
