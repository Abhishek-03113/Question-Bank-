import mongoose, { Schema, Document } from 'mongoose';

export interface ICsFundamental extends Document {
    id: number;
    question: string;
    answer: string;
    category: string;
    section: string;
    difficulty: string;
    created_at: string;
}

const CsFundamentalsSchema = new Schema<ICsFundamental>(
    {
        id: { type: Number, required: true, unique: true },
        question: { type: String },
        answer: { type: String },
        category: { type: String },
        section: { type: String },
        difficulty: { type: String },
        created_at: { type: String },
    },
    { timestamps: false }
);

const CsFundamental =
    mongoose.models.CsFundamental ||
    mongoose.model<ICsFundamental>('CsFundamental', CsFundamentalsSchema, 'cs_fundamentals');

export default CsFundamental;
