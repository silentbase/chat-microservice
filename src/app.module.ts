import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './message/message.module';
import { UserService } from './message/services/user.service';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MessagesModule],
  controllers: [AppController],
  providers: [AppService, UserService],

})
export class AppModule { }