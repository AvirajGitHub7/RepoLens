import { useState, useEffect } from "react";
import { collection, doc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { analysisConverter } from "@/lib/db/models/analysis.model";
import { useAuthContext } from "@/lib/context/AuthContext";
import { Analysis } from "@/lib/types";

const COLLECTION = "analyses";

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

    setLoading(true);
    
    const col = collection(db, COLLECTION).withConverter(analysisConverter);
    const q = query(col, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const results = snap.docs.map((d) => d.data());
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAnalyses(results);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err instanceof Error ? err : new Error("Failed to fetch analyses"));
        setLoading(false);
      }
    );

    return () => unsubscribe();
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

    setLoading(true);

    const ref = doc(db, COLLECTION, id).withConverter(analysisConverter);
    
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setAnalysis(snap.exists() ? snap.data() : null);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err instanceof Error ? err : new Error("Failed to fetch analysis"));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, id]);

  return { analysis, loading, error };
}
