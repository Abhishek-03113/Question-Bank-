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

    return (
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#000]/80 backdrop-blur-sm p-4"
        >
            <div className="bg-bgPrimary border border-accentLime/30 shadow-[0_0_50px_rgba(204,255,0,0.05)] w-full max-w-4xl max-h-[85vh] flex flex-col font-sans">
                <div className="flex justify-between items-start p-6 sm:p-8 border-b border-border">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white pr-4 leading-snug">{title}</h2>
                    <button
                        onClick={onClose}
                        className="shrink-0 text-textMuted hover:text-accentPink text-2xl leading-none transition-colors"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                <div className="overflow-y-auto p-6 sm:p-8 flex-1 text-base text-textPrimary">
                    {!showAnswer ? (
                        <div className="h-full min-h-[30vh] flex flex-col items-center justify-center">
                            <button
                                onClick={() => setShowAnswer(true)}
                                className="px-8 py-4 bg-accentLime/10 text-accentLime border border-accentLime hover:bg-accentLime hover:text-bgPrimary text-sm font-mono font-bold uppercase tracking-widest transition-all focus:outline-none"
                            >
                                [ SHOW ANSWER ]
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {renderContent ? (
                                renderContent(item)
                            ) : (
                                <DefaultContent item={item} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DefaultContent({ item }: { item: Record<string, unknown> }) {
    const skip = new Set(['_id', '__v', 'id']);
    return (
        <div className="space-y-6">
            {Object.entries(item)
                .filter(([k, v]) => !skip.has(k) && v !== null && v !== undefined && v !== '')
                .map(([key, value]) => (
                    <div key={key}>
                        <p className="font-mono text-[11px] font-bold tracking-widest uppercase text-accentLime mb-3 flex items-center">
                            <span className="opacity-50 mr-2">{"//"}</span> {key.replace(/_/g, ' ')}
                        </p>
                        <div className="text-[15px] font-medium text-textPrimary/90 leading-relaxed whitespace-pre-wrap p-4 bg-surface rounded-md border border-border/60 shadow-inner">
                            {String(value)}
                        </div>
                    </div>
                ))}
            {Object.keys(item).length === skip.size && (
                <div className="text-textMuted font-mono text-xs uppercase tracking-widest py-8 text-center border border-dashed border-border rounded-md">
                    {"[ NO READABLE DATA BLOCKS FOUND ]"}
                </div>
            )}
        </div>
    );
}
