import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "@sf/interfaces/modules/user/dto/create.user.dto";
import {LoginUserDto} from "@sf/interfaces/modules/user/dto/login.user.dto";
import {AuthUserInterface} from "@sf/interfaces/modules/user/interfaces/auth.user.interface";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('register')
  registration(@Body() dto: CreateUserDto): Promise<CreateUserDto> {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<AuthUserInterface> {
    return this.authService.login(dto);
  }
}
