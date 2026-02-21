import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AptitudeQuestion from '@/domains/aptitude/aptitude.model';
import CsFundamental from '@/domains/cs-fundamentals/cs-fundamentals.model';
import DsaQuestion from '@/domains/dsa/dsa.model';
import SqlQuestion from '@/domains/sql/sql.model';
import HldQuestion from '@/domains/hld/hld.model';
import LldQuestion from '@/domains/lld/lld.model';
import InterviewQuestion from '@/domains/interview-questions/interview-questions.model';
import JobPortal from '@/domains/job-portals/job-portals.model';
import ColdDm from '@/domains/cold-dms/cold-dms.model';

export async function GET() {
    try {
        await connectDB();

        const [
            aptitude,
            csFundamentals,
            dsa,
            sql,
            hld,
            lld,
            interviewQuestions,
            interviewDomains,
            jobPortals,
            coldDms,
        ] = await Promise.all([
            AptitudeQuestion.countDocuments(),
            CsFundamental.countDocuments(),
            DsaQuestion.countDocuments(),
            SqlQuestion.countDocuments(),
            HldQuestion.countDocuments(),
            LldQuestion.countDocuments(),
            InterviewQuestion.countDocuments(),
            InterviewQuestion.distinct('domain'),
            JobPortal.countDocuments(),
            ColdDm.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                aptitude,
                csFundamentals,
                dsa,
                sql,
                hld,
                lld,
                interviewQuestions,
                interviewDomains: interviewDomains.length,
                jobPortals,
                coldDms,
            },
        });
    } catch (err: unknown) {
        const e = err as { message?: string };
        return NextResponse.json({ success: false, error: e.message || 'Internal server error' }, { status: 500 });
    }
}
