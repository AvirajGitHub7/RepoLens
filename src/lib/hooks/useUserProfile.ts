import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userConverter } from "@/lib/db/models/user.model";
import { useAuthContext } from "@/lib/context/AuthContext";
import { UserProfile } from "@/lib/types";

export function useUserProfile() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const docRef = doc(db, "users", user.uid).withConverter(userConverter);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time user profile:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { profile, loading };
}
