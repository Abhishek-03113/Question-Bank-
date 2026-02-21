import mongoose, { Schema, Document } from 'mongoose';

export interface IAptitudeQuestion extends Document {
    id: number;
    question: string;
    short_description: string;
    description: string;
    answer: string;
    category: string;
    section: string;
    difficulty: string;
    popularity: number;
    created_at: string;
}

const AptitudeSchema = new Schema<IAptitudeQuestion>(
    {
        id: { type: Number, required: true, unique: true },
        question: { type: String },
        short_description: { type: String },
        description: { type: String },
        answer: { type: String },
        category: { type: String },
        section: { type: String },
        difficulty: { type: String },
        popularity: { type: Number },
        created_at: { type: String },
    },
    { timestamps: false }
);

const AptitudeQuestion =
    mongoose.models.AptitudeQuestion ||
    mongoose.model<IAptitudeQuestion>('AptitudeQuestion', AptitudeSchema, 'aptitude_questions');

export default AptitudeQuestion;
