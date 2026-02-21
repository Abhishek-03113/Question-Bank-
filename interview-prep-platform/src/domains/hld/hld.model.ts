import mongoose, { Schema, Document } from 'mongoose';

export interface IHldQuestion extends Document {
    id: number;
    question: string;
    answer: string;
    difficulty: string;
    section: string;
    explanation: string;
    examples: string;
}

const HldSchema = new Schema<IHldQuestion>(
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

const HldQuestion =
    mongoose.models.HldQuestion ||
    mongoose.model<IHldQuestion>('HldQuestion', HldSchema, 'hld_questions');

export default HldQuestion;
