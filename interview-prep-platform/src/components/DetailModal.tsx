'use client';

import { useEffect, useRef, useState } from 'react';

interface DetailModalProps {
    item: Record<string, unknown> | null;
    onClose: () => void;
    titleField?: string;
    renderContent?: (item: Record<string, unknown>) => React.ReactNode;
}

export default function DetailModal({ item, onClose, titleField = 'question', renderContent }: DetailModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    useEffect(() => {
        if (item) {
            setShowAnswer(false);
        }
    }, [item]);

    if (!item) return null;

    const title = (item[titleField] || item.title || item.Title || 'Detail') as string;

    // Find the main "question" or "description" field to show unconditionally
    const descriptionKey = Object.keys(item).find(key =>
        ['description', 'question', 'cs_question', 'Description', 'Question'].includes(key)
    );
    const descriptionText = descriptionKey ? item[descriptionKey] as string : null;
    const questionLink = (item.question_link || item.learning_resource) as string | undefined;

    // Filter out the fields we already displayed from the remaining content
    const skipFields = new Set([
        '_id', '__v', 'id', 'created_at', 'updated_at', 'createdAt', 'updatedAt', 'question_link', 'learning_resource',
        titleField, 'title', 'Title',
        ...(descriptionKey ? [descriptionKey] : [])
    ]);

    return (
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#000]/80 backdrop-blur-sm p-4"
        >
            <div className="bg-bgPrimary border border-accentLime/30 shadow-[0_0_50px_rgba(204,255,0,0.05)] w-full max-w-4xl max-h-[85vh] flex flex-col font-sans">
                <div className="flex justify-between items-start p-6 sm:p-8 border-b border-border">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-textPrimary pr-4 leading-snug">{title}</h2>
                    <button
                        onClick={onClose}
                        className="shrink-0 text-textMuted hover:text-accentPink text-2xl leading-none transition-colors"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                <div className="overflow-y-auto p-6 sm:p-8 flex-1 text-base text-textPrimary">
                    {descriptionText && (
                        <div className="mb-8 p-6 bg-surface/50 border-l-4 border-accentLime/50 rounded-r-md flex flex-col items-start">
                            <h3 className="font-mono text-[11px] font-bold tracking-widest uppercase text-textMuted mb-3 flex items-center w-full">
                                <span className="opacity-50 mr-2">{"//"}</span> PROBLEM DESCRIPTION
                            </h3>
                            <div className="text-base font-medium text-textPrimary leading-relaxed whitespace-pre-wrap w-full">
                                {descriptionText}
                            </div>
                            {questionLink && (
                                <a
                                    href={questionLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex items-center px-4 py-2 bg-accentLime/10 text-accentLime hover:bg-accentLime/20 hover:text-accentLime transition-colors text-[11px] rounded-md font-mono font-bold uppercase tracking-widest border border-accentLime/30"
                                >
                                    [ QUESTION LINK ]
                                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            )}
                        </div>
                    )}

                    {!showAnswer ? (
                        <div className="py-8 flex flex-col items-center justify-center">
                            <button
                                onClick={() => setShowAnswer(true)}
                                className="px-8 py-4 bg-accentLime/10 text-accentLime border border-accentLime hover:bg-accentLime hover:text-bgPrimary text-sm font-mono font-bold uppercase tracking-widest transition-all focus:outline-none"
                            >
                                [ SHOW ANSWER ]
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-border/50 pt-8 mt-2">
                            {renderContent ? (
                                renderContent(item)
                            ) : (
                                <DefaultContent item={item} skipFields={skipFields} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DefaultContent({ item, skipFields }: { item: Record<string, unknown>, skipFields?: Set<string> }) {
    const skip = skipFields || new Set(['_id', '__v', 'id', 'created_at', 'updated_at', 'createdAt', 'updatedAt', 'question_link', 'learning_resource']);
    return (
        <div className="space-y-6">
            {Object.entries(item)
                .filter(([k, v]) => !skip.has(k) && v !== null && v !== undefined && v !== '')
                .map(([key, value]) => {
                    const isCodeBlock = key.toLowerCase().includes('code');
                    const isArray = Array.isArray(value);

                    return (
                        <div key={key}>
                            <p className="font-mono text-[11px] font-bold tracking-widest uppercase text-accentLime mb-3 flex items-center">
                                <span className="opacity-50 mr-2">{"//"}</span> {key.replace(/_/g, ' ')}
                            </p>

                            {isArray ? (
                                <div className="flex flex-wrap gap-2 p-4 bg-surface rounded-md border border-border/60 shadow-inner">
                                    {(value as unknown[]).map((v, i) => (
                                        <span key={i} className="px-3 py-1 bg-bgPrimary text-textPrimary text-xs font-mono rounded-md border border-border">
                                            {String(v)}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className={`whitespace-pre-wrap p-5 md:p-6 rounded-md border border-border/60 shadow-inner overflow-x-auto ${isCodeBlock
                                        ? 'bg-[#0a0a0c] text-[14px] font-mono text-green-400 leading-relaxed'
                                        : 'bg-surface text-[17px] font-medium text-textPrimary dark:text-white leading-loose'
                                    }`}>
                                    {typeof value === 'string' && value.startsWith('http') ? (
                                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-accentLime hover:text-accentPink hover:underline transition-colors break-all">
                                            {value}
                                        </a>
                                    ) : (
                                        String(value)
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            {Object.keys(item).length === skip.size && (
                <div className="text-textMuted font-mono text-xs uppercase tracking-widest py-8 text-center border border-dashed border-border rounded-md">
                    {"[ NO READABLE DATA BLOCKS FOUND ]"}
                </div>
            )}
        </div>
    );
}
