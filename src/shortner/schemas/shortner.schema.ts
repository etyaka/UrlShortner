import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Shortner extends Document{
    @Prop({required:true,unique:true})
    shortcode:string

    @Prop({required:true})
    url:string;
    
    @Prop({default:Date.now()})
    startDate: Date;

    @Prop({default:null})
    lastSeenDate: Date;

    @Prop({default:0})
    redirectCount:Number;
}

export const ShortnerSchema = SchemaFactory.createForClass(Shortner);