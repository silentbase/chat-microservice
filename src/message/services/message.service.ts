import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';

@Injectable()
export class MessageService {
  createMsg(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  findAllMsgs() {
    return `This action returns all message`;
  }
}
