import { useState, useEffect } from "react";
import { getUserProfile } from "@/lib/db/repositories/user.repository";
import { useAuthContext } from "@/lib/context/AuthContext";
import { UserProfile } from "@/lib/types";

export function useUserProfile() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        setProfile(null);
        setLoading(false);
      }, 0);
      return;
    }

    let isMounted = true;

    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getUserProfile(user!.uid);
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { profile, loading };
}
