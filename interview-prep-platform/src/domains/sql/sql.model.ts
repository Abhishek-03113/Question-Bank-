import mongoose, { Schema, Document } from 'mongoose';

export interface ISqlQuestion extends Document {
    id: number;
    question: string;
    answer: string;
    category: string;
    difficulty: string;
    type: string;
    created_at: string;
}

const SqlSchema = new Schema<ISqlQuestion>(
    {
        id: { type: Number, required: true, unique: true },
        question: { type: String },
        answer: { type: String },
        category: { type: String },
        difficulty: { type: String },
        type: { type: String },
        created_at: { type: String },
    },
    { timestamps: false }
);

const SqlQuestion =
    mongoose.models.SqlQuestion ||
    mongoose.model<ISqlQuestion>('SqlQuestion', SqlSchema, 'sql_questions');

export default SqlQuestion;
