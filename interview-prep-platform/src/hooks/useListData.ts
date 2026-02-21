'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchState<T> {
    data: T[];
    total: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
}

export function useListData<T>(
    endpoint: string,
    params: Record<string, string | number | undefined>
) {
    const [state, setState] = useState<FetchState<T>>({
        data: [],
        total: 0,
        totalPages: 1,
        loading: true,
        error: null,
    });

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchData = useCallback(() => {
        const url = new URL(endpoint, window.location.origin);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                url.searchParams.set(key, String(value));
            }
        });

        setState((prev) => ({ ...prev, loading: true, error: null }));

        fetch(url.toString())
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setState({
                        data: json.data,
                        total: json.pagination?.total ?? json.data.length,
                        totalPages: json.pagination?.totalPages ?? 1,
                        loading: false,
                        error: null,
                    });
                } else {
                    setState((prev) => ({ ...prev, loading: false, error: json.error || 'Failed to fetch' }));
                }
            })
            .catch(() => {
                setState((prev) => ({ ...prev, loading: false, error: 'Network error' }));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint, JSON.stringify(params)]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(fetchData, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [fetchData]);

    return state;
}
