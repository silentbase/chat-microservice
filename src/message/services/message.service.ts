import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository){}
  
  createMsg(createMessageDto: CreateMessageDto) {
    return this.messageRepository.create(createMessageDto);
  }

  findAllMsgs() {
    return `This action returns all message`;
  }
}
