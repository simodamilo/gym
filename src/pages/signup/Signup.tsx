import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { PageSEO } from "../../components/seo/PageSEO";
import { PublicPageSettings } from "../../components/publicPageSettings/PublicPageSettings";

export const Signup = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) navigate(routes.workouts);
    }, [user, navigate]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await signUp(email, password);
        if (error) setError(error.message);
        else setSuccess(true);

        setLoading(false);
    };

    return (
        <>
            <PageSEO titleKey="seo.titles.signup" descriptionKey="seo.descriptions.signup" />
            <div className="h-dvh flex items-center justify-center px-4 bg-[var(--bg-primary)] relative">
                <PublicPageSettings />
                <div className="w-full max-w-md bg-[var(--bg-elevated)] shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-8 text-[var(--text-primary)]">{t("auth.signup.title")}</h2>

                {success ? (
                    <p className="text-green-600 text-center">{t("auth.signup.success_message")}</p>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <input
                            type="email"
                            placeholder={t("auth.signup.email_placeholder")}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder={t("auth.signup.password_placeholder")}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? t("auth.signup.signing_up") : t("auth.signup.signup_button")}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm">
                        <span className="text-[var(--brand-primary)] hover:underline cursor-pointer font-medium" onClick={() => navigate(routes.login)}>
                            {t("auth.signup.login_link")}
                        </span>
                    </p>
                </div>
            </div>
            </div>
        </>
    );
};
