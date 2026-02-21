'use client';

import { useEffect, useRef } from 'react';

interface DetailModalProps {
    item: Record<string, unknown> | null;
    onClose: () => void;
    titleField?: string;
    renderContent?: (item: Record<string, unknown>) => React.ReactNode;
}

export default function DetailModal({ item, onClose, titleField = 'question', renderContent }: DetailModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!item) return null;

    const title = (item[titleField] || item.title || item.Title || 'Detail') as string;

    return (
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#000]/80 backdrop-blur-sm p-4"
        >
            <div className="bg-bgPrimary border border-accentLime/30 shadow-[0_0_50px_rgba(204,255,0,0.05)] w-full max-w-2xl max-h-[85vh] flex flex-col font-sans">
                <div className="flex justify-between items-start p-6 border-b border-border">
                    <h2 className="text-xl font-bold tracking-tight text-white pr-4 leading-snug">{title}</h2>
                    <button
                        onClick={onClose}
                        className="shrink-0 text-textMuted hover:text-accentPink text-2xl leading-none transition-colors"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                <div className="overflow-y-auto p-6 flex-1 text-sm text-textPrimary space-y-6">
                    {renderContent ? (
                        renderContent(item)
                    ) : (
                        <DefaultContent item={item} />
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
