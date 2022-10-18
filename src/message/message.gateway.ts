import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayDisconnect } from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'
import { MessageService } from './services/message.service';
import { CreateMessageDto } from './dto/create-message.dto';

import { NatsService } from 'src/nats/nats.service';

const clients = new Map();

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
    clients.set(client.handshake.headers.name, client.id);
    console.log(clients.values())
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
   
    client.to(clients.get(createMessageDto.to)).emit('msg', createMessageDto)
    
      
    console.log(createMessageDto)
    //console.log(client.handshake.headers.name)
   
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
    console.log(createMessageDto.from)
    client.to(clients.get(createMessageDto.from)).emit('confirmMsg', createMessageDto);
    this.messageService.createMsg(createMessageDto);
    return "msg from "+createMessageDto.from+" to "+createMessageDto.to+" confirmed"
  }

  /**
   * es werden alle nachrichten mit bestimmten sender und empfänger von der datenbank abgerufen
   * hauptsächlich für chatverläufe
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('findAllMessages')
  async findAllMsgs(@MessageBody() name: string, @ConnectedSocket() client: Socket) {
    console.log(name+"....")
    return this.messageService.findAllMsgs(name);
  }

  /**
   * diese methode gibt alle clients wieder die momentan mit dem server verbunden sind
   * davor wird aber sichergestellt, das nicht einem client seine eigene instanz zurückgeschickt wird
   * @param createMessageDto 
   * @param client 
   * @returns 
   */
  @SubscribeMessage('findOnlineUsers')
  async findOnlineUsers(@ConnectedSocket() client: Socket) {
    
    let array = Array.from(clients.keys())
    let index = array.indexOf(client.handshake.headers.name)
    //let index = array.findIndex((contact) => contact == client.handshake.headers.name)
    array.splice(index,1)
    console.log(index)
    console.log(array)
    return array;
  }
}
