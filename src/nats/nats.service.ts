import { Publisher } from "@nestjs-plugins/nestjs-nats-streaming-transport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NatsService {
    constructor(
        private readonly publisher: Publisher){}

    async publishEvent(eventName:string, event:string){
        this.publisher.emit(eventName, event).subscribe((guid) =>
        console.log(guid));
    }
}