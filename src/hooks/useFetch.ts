import { useState, useEffect } from 'react';

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, options?: RequestInit): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // AbortController verhindert Memory Leaks bei schnellen Seitenwechseln
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, { ...options, signal });

        if (!response.ok) {
          throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        // Check ob Komponente noch gemountet ist (via signal)
        if (!signal.aborted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!signal.aborted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Ein unbekannter Fehler ist aufgetreten');
          }
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup Funktion
    return () => {
      abortController.abort();
    };
  }, [url]); // Hook feuert neu, wenn sich die URL ändert

  return { data, loading, error };
}