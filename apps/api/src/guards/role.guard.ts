import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user: UserEntity = request.user;

    if (!user) {
      return false;
    }

    if (user.isAdmin) {
      return true;
    }
  }
}
