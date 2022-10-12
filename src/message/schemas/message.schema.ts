import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type MessageDocument = Message & Document;

@Schema()
export class Message {

    @Prop({required:true})
    from:string;

    @Prop({required:true})
    to:string;

    @Prop()
    date:string;

    @Prop({required:true})
    text:string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);