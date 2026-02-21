import mongoose, { Schema, Document } from 'mongoose';

export interface IDsaQuestion extends Document {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    short_answer: string;
    solution_link: string;
    learning_resource: string;
    tags: string[];
    index: number;
    python_code: string;
    java_code: string;
    section: string;
    created_at: string;
}

const DsaSchema = new Schema<IDsaQuestion>(
    {
        id: { type: Number, required: true, unique: true },
        title: { type: String },
        description: { type: String },
        category: { type: String },
        difficulty: { type: String },
        short_answer: { type: String },
        solution_link: { type: String },
        learning_resource: { type: String },
        tags: [{ type: String }],
        index: { type: Number },
        python_code: { type: String },
        java_code: { type: String },
        section: { type: String },
        created_at: { type: String },
    },
    { timestamps: false }
);

const DsaQuestion =
    mongoose.models.DsaQuestion ||
    mongoose.model<IDsaQuestion>('DsaQuestion', DsaSchema, 'dsa_questions');

export default DsaQuestion;
