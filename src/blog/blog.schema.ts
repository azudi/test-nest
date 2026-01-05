import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })

export class Blog {

    @Prop()
    author: string;

    @Prop()
    content: string;

    @Prop()
    slug: string

    @Prop({ unique: true })
    title: string;
}


export const BlogSchema = SchemaFactory.createForClass(Blog);