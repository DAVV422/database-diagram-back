import { Global, Module } from '@nestjs/common';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '../user/services/user.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [UserModule, ConfigModule],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule { }