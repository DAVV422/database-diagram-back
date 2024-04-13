import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeederModule { }
