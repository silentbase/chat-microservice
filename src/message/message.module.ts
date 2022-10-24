import { Module } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { MessageGateway } from './message.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { MessageSchema } from './schemas/message.schema';
import { MessageRepository } from './repositories/message.repository';
import { Mongoose } from 'mongoose';
import { NatsService } from 'src/message/services/nats.service';
import { NatsStreamingContext, NatsStreamingTransport, Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { UserService } from './services/user.service';


@Module({
  imports: [NatsStreamingTransport.register(
    {
      clientId: 'gateway-publisher',
      clusterId: 'my-tutorial',
      connectOptions: {
        url: 'http://127.0.0.1:4222',
      },
    }
  ),
  MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}])],
  providers: [MessageGateway, MessageService, MessageRepository, Mongoose, NatsService, UserService],
  controllers: [],
  exports: [NatsService, UserService]
})
export class MessagesModule {}