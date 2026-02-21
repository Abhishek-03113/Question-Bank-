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
import HomeClient from './home-client';

async function getStats() {
  try {
    await connectDB();
    const [aptitude, csFundamentals, dsa, sql, hld, lld, interviewQuestions, interviewDomains, jobPortals, coldDms] =
      await Promise.all([
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
    return { aptitude, csFundamentals, dsa, sql, hld, lld, interviewQuestions, interviewDomains: interviewDomains.length, jobPortals, coldDms };
  } catch {
    return { aptitude: 0, csFundamentals: 0, dsa: 0, sql: 0, hld: 0, lld: 0, interviewQuestions: 0, interviewDomains: 0, jobPortals: 0, coldDms: 0 };
  }
}

export default async function Home() {
  const stats = await getStats();
  const total = stats.aptitude + stats.csFundamentals + stats.dsa + stats.sql +
    stats.hld + stats.lld + stats.interviewQuestions + stats.jobPortals + stats.coldDms;

  const groups = ['Core Technical', 'Interview Prep'] as const;

  return <HomeClient stats={stats} total={total} groups={groups} />;
}
