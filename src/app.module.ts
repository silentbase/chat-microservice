import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './message/message.module';
import { UserService } from './message/services/user.service';


@Module({
  imports: [
    
    MongooseModule.forRoot('mongodb://suheib:lorop@ac-ltdv3ai-shard-00-00.5z6mksz.mongodb.net:27017,ac-ltdv3ai-shard-00-01.5z6mksz.mongodb.net:27017,ac-ltdv3ai-shard-00-02.5z6mksz.mongodb.net:27017/?ssl=true&replicaSet=atlas-428fuz-shard-0&authSource=admin&retryWrites=true&w=majority'),
    MessagesModule],
  controllers: [AppController],
  providers: [AppService, UserService],

})
export class AppModule { }