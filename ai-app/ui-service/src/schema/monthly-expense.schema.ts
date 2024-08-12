import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema'; // Adjust the import path as necessary

export interface ExpenseInfo {
  amount: number;
  category: string;
  vendor: string;
  location: string;
  type: string;
}

@Schema()
export class MonthlyExpense extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  month: string; // Format: "YYYY-MM"

  @Prop({
    type: [Object],
    default: [],
  })
  transactions: ExpenseInfo[];

  @Prop({
    default: Date.now,
  })
  createdAt: Date;
}

export const MonthlyExpenseSchema =
  SchemaFactory.createForClass(MonthlyExpense);
export type MonthlyExpenseDocument = MonthlyExpense & Document;
