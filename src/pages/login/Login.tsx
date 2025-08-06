import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../store/supabaseClient";

export const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if already logged in on mount and redirect
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate("/gym/workouts");
            }
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
        <div>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
        </div>
    );
};
