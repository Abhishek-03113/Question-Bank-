import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewQuestion extends Document {
    id: number;
    question: string;
    answer: string;
    difficulty: string;
    section: string;
    domain: string;
}

const InterviewQuestionSchema = new Schema<IInterviewQuestion>(
    {
        id: { type: Number, required: true },
        question: { type: String },
        answer: { type: String },
        difficulty: { type: String },
        section: { type: String },
        domain: { type: String },
    },
    { timestamps: false }
);

InterviewQuestionSchema.index({ domain: 1, difficulty: 1 });

const InterviewQuestion =
    mongoose.models.InterviewQuestion ||
    mongoose.model<IInterviewQuestion>('InterviewQuestion', InterviewQuestionSchema, 'interview_questions');

export default InterviewQuestion;
