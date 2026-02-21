import mongoose, { Schema, Document } from 'mongoose';

export interface IColdDm extends Document {
    id: string;
    Title: string;
    Description: string;
    Category: string;
}

const ColdDmSchema = new Schema<IColdDm>(
    {
        id: { type: String, required: true, unique: true },
        Title: { type: String },
        Description: { type: String },
        Category: { type: String },
    },
    { timestamps: false }
);

const ColdDm =
    mongoose.models.ColdDm ||
    mongoose.model<IColdDm>('ColdDm', ColdDmSchema, 'cold_dms');

export default ColdDm;
