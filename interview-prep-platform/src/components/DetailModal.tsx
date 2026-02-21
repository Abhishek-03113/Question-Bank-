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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
                <div className="flex justify-between items-start p-5 border-b">
                    <h2 className="text-base font-semibold text-gray-900 pr-4 leading-snug">{title}</h2>
                    <button
                        onClick={onClose}
                        className="shrink-0 text-gray-400 hover:text-gray-600 text-xl leading-none mt-0.5"
                    >
                        ✕
                    </button>
                </div>
                <div className="overflow-y-auto p-5 flex-1 text-sm text-gray-700 space-y-4">
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
        <>
            {Object.entries(item)
                .filter(([k, v]) => !skip.has(k) && v !== null && v !== undefined && v !== '')
                .map(([key, value]) => (
                    <div key={key}>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                            {key.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {String(value)}
                        </p>
                    </div>
                ))}
        </>
    );
}
