import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, author_name, contact_email, updated_at")
        .eq("id", userId)
        .maybeSingle();
      if (!error && data) setProfile(data);
      else setProfile(null);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const {
          data: { session: initial },
        } = await supabase.auth.getSession();
        if (cancelled) return;
        setSession(initial ?? null);
        setLoading(false);
        if (initial?.user) {
          void loadProfile(initial.user.id);
        } else {
          setProfile(null);
        }
      } catch {
        if (!cancelled) {
          setSession(null);
          setProfile(null);
          setLoading(false);
        }
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setLoading(false);
      if (nextSession?.user) {
        void loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) return { error: new Error("Supabase is not configured") };
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const signUp = useCallback(async (email, password, authorName) => {
    if (!supabase) return { error: new Error("Supabase is not configured") };
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: authorName ? { author_name: authorName } : undefined,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return { error: new Error("Supabase is not configured") };
    return supabase.auth.signOut();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id);
  }, [session?.user, loadProfile]);

  const updateProfile = useCallback(
    async ({ author_name, contact_email }) => {
      if (!supabase || !session?.user) {
        return { error: new Error("Not signed in") };
      }
      const { error } = await supabase
        .from("profiles")
        .update({ author_name, contact_email })
        .eq("id", session.user.id);
      if (!error) await loadProfile(session.user.id);
      return { error };
    },
    [session?.user, loadProfile]
  );

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      configured: isSupabaseConfigured(),
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateProfile,
    }),
    [
      session,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
