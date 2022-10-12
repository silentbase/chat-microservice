import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayDisconnect } from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'
import { MessageService } from './services/message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { NatsService } from 'src/nats/nats.service';

const clients = new Set([]);

/**
 * websocket server
 * die einzelnen Metoden hören auf spezifiche Events
 * die namen der Events, werden in den  @SubscribeMessage Annotationen gesetzt
 */
 @WebSocketGateway(4000, {
  cors: {
    origin:'*'
  }
})

export class MessageGateway{
  @WebSocketServer()
  server: Server

  
  constructor(private readonly messageService: MessageService,
    private readonly natsService: NatsService) {}
   

  /**
   * wenn sich ein client mit dem server verbindet,
   * wird es allen anderen verbundenen clients gebroadcastet
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  handleConnection(@ConnectedSocket() client: Socket){
    clients.add(client.handshake.headers.name)
    //console.log(clients.values())
    client.broadcast.emit('login', client.handshake.headers.name)
  }
  
   /**
   * wenn sich ein client vom server trennt,
   * wird es allen anderen verbundenen clients gebroadcastet
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  handleDisconnect(@ConnectedSocket() client: Socket){
    clients.delete(client.handshake.headers.name)
    //console.log(clients.values())
    console.log("disconnected")
    client.broadcast.emit('logout', client.handshake.headers.name)
  }
  /**
   * private 1:1 nachrichten werden verarbeitet und gespeichert
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('createMessage')
  async createMsg(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    //this.natsService.publishEvent('sendMsg', createMessageDto.from);
    this.messageService.createMsg(createMessageDto);
    client.broadcast.emit('msg', createMessageDto)
    console.log(createMessageDto)
    //console.log(client.handshake.headers.name)
    return createMessageDto;
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
   * davor wird aber sichergestellt, das nicht einem client seine eigene instanz zurückgeschickt wird
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('findOnlineUsers')
  async findOnlineUsers(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    
    let array = Array.from(clients)
    let index = array.indexOf(client.handshake.headers.name)
    //let index = array.findIndex((contact) => contact == client.handshake.headers.name)
    array.splice(index,1)
    console.log('array')
    return array;
  }
}
