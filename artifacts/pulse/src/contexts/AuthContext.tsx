import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { seedDemoAlertsIfNew } from "@/lib/seedDemoAlerts";

const DEMO_USER: User = {
  id: "demo-user-omnia",
  email: "demo@omnia.app",
  user_metadata: { full_name: "Demo Founder" },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
  role: "",
  updated_at: new Date().toISOString(),
  identities: [],
  factors: [],
  phone: "",
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: null,
  last_sign_in_at: new Date().toISOString(),
  recovery_sent_at: null,
  email_change_sent_at: null,
  new_email: null,
  new_phone: null,
  invited_at: null,
  confirmation_sent_at: null,
  confirmation_sent: null,
  phone_change: null,
  phone_change_sent_at: null,
  phone_change_sent: null,
  email_change: null,
  email_change_sent: null,
  new_email_sent_at: null,
  is_anonymous: false,
} as unknown as User;

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setDemoUser: () => void;
  clearDemoUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  setDemoUser: () => {},
  clearDemoUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session?.user) {
        void seedDemoAlertsIfNew(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setAuthTokenGetter(
      session
        ? async () => {
            const { data } = await supabase.auth.getSession();
            return data.session?.access_token ?? null;
          }
        : null
    );
  }, [session]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const setDemoUser = useCallback(() => {
    setUser(DEMO_USER);
    setSession(null);
    setLoading(false);
    void seedDemoAlertsIfNew(DEMO_USER.id);
  }, []);

  const clearDemoUser = useCallback(() => {
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, setDemoUser, clearDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
