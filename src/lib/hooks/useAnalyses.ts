import { useState, useEffect } from "react";
import { getAnalysesByUser, getAnalysis } from "@/lib/db/repositories/analysis.repository";
import { useAuthContext } from "@/lib/context/AuthContext";
import { Analysis } from "@/lib/types";

export function useAnalyses() {
  const { user } = useAuthContext();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        setAnalyses([]);
        setLoading(false);
      }, 0);
      return;
    }

    let isMounted = true;

    async function fetchAnalyses() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getAnalysesByUser(user.uid);
        if (isMounted) {
          setAnalyses(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch analyses"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAnalyses();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { analyses, loading, error };
}

export function useAnalysis(id: string) {
  const { user } = useAuthContext();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !id) {
      setTimeout(() => {
        setAnalysis(null);
        setLoading(false);
      }, 0);
      return;
    }

    let isMounted = true;

    async function fetchAnalysis() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getAnalysis(id);
        if (isMounted) {
          setAnalysis(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch analysis"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAnalysis();

    return () => {
      isMounted = false;
    };
  }, [user, id]);

  return { analysis, loading, error };
}
