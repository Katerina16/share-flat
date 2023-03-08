import {UserEntity} from "@sf/interfaces/modules/user/entities/user.entity";

export interface AuthUserInterface {
  user: UserEntity,
  token: string
}
