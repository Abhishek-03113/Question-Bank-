"use client";

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const DOMAIN_CONFIG = [
    {
        icon: '🧮',
        title: 'Aptitude',
        subtitle: 'Quantitative · Logical · Verbal',
        href: '/aptitude',
        statKey: 'aptitude' as const,
        unit: 'questions',
        group: 'Core Technical',
        accent: 'text-accentLime',
    },
    {
        icon: '💻',
        title: 'CS Fundamentals',
        subtitle: 'DBMS · OS · Networks · OOP',
        href: '/cs-fundamentals',
        statKey: 'csFundamentals' as const,
        unit: 'questions',
        group: 'Core Technical',
        accent: 'text-accentLime',
    },
    {
        icon: '🌿',
        title: 'DSA',
        subtitle: 'Top-75 · FAANG · Graph',
        href: '/dsa',
        statKey: 'dsa' as const,
        unit: 'questions',
        group: 'Core Technical',
        accent: 'text-accentLime',
    },
    {
        icon: '🗄️',
        title: 'SQL',
        subtitle: 'Theory · Practical',
        href: '/sql',
        statKey: 'sql' as const,
        unit: 'questions',
        group: 'Core Technical',
        accent: 'text-accentLime',
    },
    {
        icon: '🏗️',
        title: 'High-Level Design',
        subtitle: 'System Design',
        href: '/hld',
        statKey: 'hld' as const,
        unit: 'questions',
        group: 'Core Technical',
        accent: 'text-accentLime',
    },
    {
        icon: '🔧',
        title: 'Low-Level Design',
        subtitle: 'OOP Design · Patterns',
        href: '/lld',
        statKey: 'lld' as const,
        unit: 'questions',
        group: 'Core Technical',
        accent: 'text-accentLime',
    },
    {
        icon: '🎤',
        title: 'Interview Questions',
        subtitle: 'AI · Backend · Frontend · Java · ...',
        href: '/interview-questions/general',
        statKey: 'interviewQuestions' as const,
        unit: 'questions',
        group: 'Interview Prep',
        accent: 'text-accentPink',
    },
    {
        icon: '🌐',
        title: 'Job Portals',
        subtitle: 'General · Remote · Tech',
        href: '/job-portals',
        statKey: 'jobPortals' as const,
        unit: 'portals',
        group: 'Interview Prep',
        accent: 'text-accentPink',
    },
    {
        icon: '✉️',
        title: 'Cold DM Templates',
        subtitle: 'Networking · Follow-up · Referral',
        href: '/cold-dms',
        statKey: 'coldDms' as const,
        unit: 'templates',
        group: 'Interview Prep',
        accent: 'text-accentPink',
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
};

export default function HomeClient({ stats, total, groups }: { stats: Record<string, number>; total: number; groups: readonly string[] }) {
    return (
        <div className="min-h-screen theme-bg text-textPrimary">
            {/* Nav bar */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl border-b border-border bg-bgPrimary/60"
            >
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <span className="font-sans font-black text-xl tracking-tighter hover:text-accentLime transition-colors cursor-pointer">
                        INTERVIEW PREP
                    </span>
                    <span className="text-sm text-textMuted hidden sm:block font-mono tracking-tight">
                        {total.toLocaleString()}_QUESTIONS.9_DOMAINS
                    </span>
                </div>
            </motion.header>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-5xl mx-auto py-20 px-6 sm:py-32"
            >
                {/* Hero */}
                <div className="mb-24 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <motion.div variants={itemVariants} className="inline-block mb-8 px-4 py-1.5 border border-accentLime/30 rounded-full bg-accentLime/5 text-accentLime text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                        Atmospheric Dark Theme Active
                    </motion.div>
                    <motion.h1
                        variants={itemVariants}
                        className="font-sans text-6xl sm:text-8xl font-black leading-[0.9] tracking-tighter"
                    >
                        THE ULTIMATE<br />
                        <span className="text-glow-lime text-accentLime">ARSENAL.</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="mt-8 text-lg sm:text-xl text-textMuted max-w-2xl text-balance font-medium">
                        {total.toLocaleString()} curated questions engineered to break down complexity. DSA, HLD, LLD, and beyond. No generic slop. <span className="text-textPrimary">Just unapologetic preparation.</span>
                    </motion.p>

                    <motion.div variants={itemVariants} className="mt-12 flex flex-wrap gap-4 justify-center sm:justify-start">
                        <Link href="/dsa">
                            <span className="inline-block px-8 py-4 bg-accentLime text-[#000] font-sans font-black tracking-tight text-lg rounded-sm hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(204,255,0,0.3)] transition-all duration-300">
                                START WITH DSA →
                            </span>
                        </Link>
                    </motion.div>
                </div>

                {/* Groups */}
                {groups.map((group) => (
                    <motion.div key={group} variants={itemVariants} className="mb-20">
                        <h2 className="mb-8 text-sm font-mono tracking-widest uppercase text-textMuted border-b border-border/60 pb-3 flex items-center justify-between">
                            <span>{group}</span>
                            <span className="h-1 w-1 rounded-full bg-textMuted"></span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {DOMAIN_CONFIG.filter((d) => d.group === group).map((domain) => (
                                <Link
                                    key={domain.href}
                                    href={domain.href}
                                    className="block h-full group outline-none"
                                >
                                    <motion.div
                                        variants={itemVariants}
                                        className="card-premium h-full flex flex-col justify-between p-7"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between mb-6">
                                                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-110">
                                                    {domain.icon}
                                                </span>
                                                <span className={`font-mono text-xs font-bold px-2 py-1 rounded bg-bgPrimary/50 border border-border/50 group-hover:border-transparent group-hover:bg-transparent transition-colors ${domain.accent}`}>
                                                    {(stats[domain.statKey] || 0).toLocaleString()} {domain.unit}
                                                </span>
                                            </div>
                                            <h3 className="font-sans font-black text-xl group-hover:text-textPrimary transition-colors tracking-tight text-textPrimary/90">
                                                {domain.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-textMuted font-medium leading-relaxed">
                                                {domain.subtitle}
                                            </p>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.main>

            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="py-12 text-center text-xs text-textMuted font-mono border-t border-border/30 bg-bgPrimary/50"
            >
                INTERVIEW PREP PLATFORM {'//'} {new Date().getFullYear()} {'//'} ATMOSPHERIC EDITION
            </motion.footer>
        </div>
    );
}
