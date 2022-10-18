import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Message } from "../entities/message.entity";
import { MessageDocument } from "../schemas/message.schema";


@Injectable()
export class MessageRepository{
    constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>){}

    //messageFilterQuery: FilterQuery<Message>
    async findAll(name:string): Promise<Message[]>{
        return this.messageModel.find({ $or:[  {to: name}, {from: name}]});
    }

    async create(message:Message): Promise<Message>{
        const newMesssage = new this.messageModel(message);
        return newMesssage.save();
    }
}