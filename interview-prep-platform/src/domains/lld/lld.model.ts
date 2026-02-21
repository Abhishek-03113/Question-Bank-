import mongoose, { Schema, Document } from 'mongoose';

export interface ILldQuestion extends Document {
    id: number;
    question: string;
    answer: string;
    difficulty: string;
    section: string;
    explanation: string;
    examples: string;
}

const LldSchema = new Schema<ILldQuestion>(
    {
        id: { type: Number, required: true, unique: true },
        question: { type: String },
        answer: { type: String },
        difficulty: { type: String },
        section: { type: String },
        explanation: { type: String },
        examples: { type: String },
    },
    { timestamps: false }
);

const LldQuestion =
    mongoose.models.LldQuestion ||
    mongoose.model<ILldQuestion>('LldQuestion', LldSchema, 'lld_questions');

export default LldQuestion;
