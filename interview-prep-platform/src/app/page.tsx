'use client';

import Link from 'next/link';

const DOMAINS = [
  { icon: '🧮', title: 'Aptitude Questions', meta: '170 questions', badge: 'Quantitative · Logical · Verbal', href: '/aptitude', group: 'Core Technical' },
  { icon: '💻', title: 'CS Fundamentals', meta: '117 questions', badge: 'DBMS · OS · Networks · OOP', href: '/cs-fundamentals', group: 'Core Technical' },
  { icon: '🌲', title: 'DSA Questions', meta: '638 questions', badge: 'Top-75 · FAANG · Graph', href: '/dsa', group: 'Core Technical' },
  { icon: '🗄️', title: 'SQL Questions', meta: '160 questions', badge: 'Theory · Practical', href: '/sql', group: 'Core Technical' },
  { icon: '🏗️', title: 'HLD Questions', meta: '58 questions', badge: 'System Design', href: '/hld', group: 'Core Technical' },
  { icon: '🔧', title: 'LLD Questions', meta: '49 questions', badge: 'OOP Design · Patterns', href: '/lld', group: 'Core Technical' },
  { icon: '🎤', title: 'Interview Questions', meta: '500+ questions · 7 domains', badge: 'AI · Backend · Frontend · Java · ...', href: '/interview-questions/general', group: 'Interview Prep' },
  { icon: '🌐', title: 'Job Portals', meta: '100 portals', badge: 'General · Remote · Tech', href: '/job-portals', group: 'Interview Prep' },
  { icon: '✉️', title: 'Cold DM Templates', meta: '104 templates', badge: 'Networking · Follow-up · Referral', href: '/cold-dms', group: 'Interview Prep' },
];

export default function Home() {
  const groups = ['Core Technical', 'Interview Prep'];
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-[#1a1a2e] text-white px-6 py-5 rounded-xl mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎯 Interview Prep Platform</h1>
        <span className="text-sm opacity-70">9 Resource Domains · 1800+ Questions</span>
      </div>
      {groups.map((group) => (
        <div key={group} className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{group}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOMAINS.filter((d) => d.group === group).map((domain) => (
              <Link key={domain.href} href={domain.href} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-400 transition-colors group">
                <div className="text-3xl mb-2">{domain.icon}</div>
                <h2 className="text-sm font-semibold text-[#1a1a2e] mb-1 group-hover:text-blue-600">{domain.title}</h2>
                <p className="text-xs text-gray-500 mb-2">{domain.meta}</p>
                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-500 rounded-full text-xs">{domain.badge}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
