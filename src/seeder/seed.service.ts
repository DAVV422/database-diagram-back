import { Injectable, Logger } from '@nestjs/common';

import { handlerError } from '../common/utils/handlerError.utils';
import { ROLES } from '../common/constants';
import { CreateUserDto } from '../user/dto';
import { UserService } from '../user/services/user.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeederService');

  constructor(private readonly userService: UserService) { }

  public async runSeeders() {
    if (process.env.APP_PROD == true) return { message: 'No se puede ejecutar seeders en producción' };
    try {
      const user1: CreateUserDto = {
        nombre: 'diego',
        apellido: 'vargas',
        email: 'diego@live.com',
        password: '123456789',
        role: ROLES.ADMIN,
      };

      const user2: CreateUserDto = {
        nombre: 'alberto',
        apellido: 'vargas',
        email: 'alberto@live.com',
        password: '123456789',
        role: ROLES.ADMIN,
      };
      
      await this.userService.createUser(user1);
      await this.userService.createUser(user2);
      return { message: 'Seeders ejecutados correctamente' };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
