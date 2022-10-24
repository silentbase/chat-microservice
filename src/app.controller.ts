import { Controller, Get, Param, Res, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './message/services/user.service';

@Controller('/signIn')
export class AppController {
  constructor() {}

}
