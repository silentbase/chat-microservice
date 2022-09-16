import { Module } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { MessageGateway } from './message.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { MessageSchema } from './schemas/message.schema';
import { MessageRepository } from './repositories/message.repository';
import { Mongoose } from 'mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}])],
  providers: [MessageGateway, MessageService, MessageRepository, Mongoose]
})
export class MessagesModule {}