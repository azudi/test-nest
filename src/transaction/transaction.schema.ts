import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })

export class Transaction {

    @Prop({ default: null })
    status?: string;

    @Prop({ default: null })
    refrence?: string;

    @Prop({ default: () => new Date() })
    createdAt?: Date;

    @Prop({ default: () => new Date() })
    updatedAt?: Date;

    @Prop()
    paymentId?: string;
}


export const TransactionSchema = SchemaFactory.createForClass(Transaction);