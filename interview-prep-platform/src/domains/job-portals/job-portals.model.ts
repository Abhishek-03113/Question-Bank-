import mongoose, { Schema, Document } from 'mongoose';

export interface IJobPortal extends Document {
    id: number;
    name: string;
    description: string;
    category: string;
    website_url: string;
    logo_url: string;
    is_premium: boolean;
    job_types: string[];
    locations: string[];
    rating: number;
    popularity: number;
}

const JobPortalSchema = new Schema<IJobPortal>(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String },
        description: { type: String },
        category: { type: String },
        website_url: { type: String },
        logo_url: { type: String },
        is_premium: { type: Boolean },
        job_types: [{ type: String }],
        locations: [{ type: String }],
        rating: { type: Number },
        popularity: { type: Number },
    },
    { timestamps: false }
);

const JobPortal =
    mongoose.models.JobPortal ||
    mongoose.model<IJobPortal>('JobPortal', JobPortalSchema, 'job_portals');

export default JobPortal;
