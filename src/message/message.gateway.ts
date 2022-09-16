import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'
import { MessageService } from './services/message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

/**
 * websocket server
 * die einzelnen Metoden hören auf spezifiche Events
 * die namen der Events, werden in den  @SubscribeMessage Annotationen gesetzt
 */
@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server: Server
  
  constructor(private readonly messageService: MessageService) {}

  /**
   * private 1:1 nachrichten werden verarbeitet und gespeichert
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('createMessage')
  async createMsg(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    return this.messageService.createMsg(createMessageDto);
  }
  
  /**
   * wenn ein client eine nachricht empfangen hat sendet er eine bestätigung,
   * diese wird hier verarbeitet und der sender wird über den empfang der Nachricht informiert
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('confirmMsg')
  async confirmMsg(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    return this.messageService.createMsg(createMessageDto);
  }

  /**
   * es werden alle nachrichten mit bestimmten sender und empfänger von der datenbank abgerufen
   * hauptsächlich für chatverläufe
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('findAllMessage')
  async findAllMsgs(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    return this.messageService.findAllMsgs();
  }

  /**
   * diese methode gibt alle clients wieder die momentan mit dem server verbunden sind
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('findOnlineUsers')
  async findOnlineUsers(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    return 3;
  }

  /**
   * wenn sich ein client mit dem server verbindet,
   * wird es allen anderen verbundenen clients gebroadcastet
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('login')
  async login(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    return 3;
  }

  /**
   * wenn sich ein client vom server trennt,
   * wird es allen anderen verbundenen clients gebroadcastet
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('logout')
  async logout(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    return 3;
  }
}
