import { Prop, Schema as MainSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@MainSchema()
export class User extends Document {
  @Prop({
    type: String,
    unique: true,
  })
  userId: string;
  
  @Prop({
    default: Date.now,
  })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
