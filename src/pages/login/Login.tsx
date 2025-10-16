import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../store/supabaseClient";

export const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Parse tokens returned in the URL by Supabase (magic-link / redirect flows)
        supabase.auth
            .getSession()
            .then(({ data: { session } }) => {
                if (session) {
                    navigate("/gym/workouts");
                    return;
                }

                // Fallback: check existing session if no tokens in URL
                supabase.auth.getSession().then(({ data: { session } }) => {
                    if (session) navigate("/gym/workouts");
                });
            })
            .catch(() => {
                // If parsing fails, still try the normal session check
                supabase.auth.getSession().then(({ data: { session } }) => {
                    if (session) navigate("/gym/workouts");
                });
            });

        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                navigate("/gym/workouts");
            }
        });

        // Cleanup listener on unmount
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, [navigate]);

    return (
        <div className="p-4 h-dvh">
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
        </div>
    );
};
