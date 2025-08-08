import type { AuthError, Provider, Session, User } from "@supabase/supabase-js";
import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { supabase } from "../../store/supabaseClient";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    signIn: () => Promise<{ data: { provider: Provider; url: string | null }; error: AuthError | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("session onAuthStateChange: ", session);
            setSession(session);
            setUser(session?.user || null);
            setLoading(false);
        });
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    // In case we want to manually trigger a signIn (instead of using Auth UI)
    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { skipBrowserRedirect: false },
        });
        console.log("data: ", data);
        console.log("error: ", error);
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        console.log("error: ", error);
        if (!error) {
            setUser(null);
            setSession(null);
        }
        return { error };
    };

    return <AuthContext.Provider value={{ user, session, signIn, signOut }}>{!loading ? children : `<div>Loading...</div>`}</AuthContext.Provider>;
};

export default AuthProvider;
