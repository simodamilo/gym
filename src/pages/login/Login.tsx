import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { PageSEO } from "../../components/seo/PageSEO";
import { PublicPageSettings } from "../../components/publicPageSettings/PublicPageSettings";

export const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, signInWithEmail } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate(routes.workouts);
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await signInWithEmail(email, password);
        if (error) setError(error.message);

        setLoading(false);
    };

    return (
        <>
            <PageSEO titleKey="seo.titles.login" descriptionKey="seo.descriptions.login" />
            <div className="h-dvh flex items-center justify-center px-4 bg-[var(--bg-primary)] relative">
                <PublicPageSettings />
                <div className="w-full max-w-md bg-[var(--bg-elevated)] shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-8 text-[var(--text-primary)]">{t("auth.login.title")}</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder={t("auth.login.email_placeholder")}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder={t("auth.login.password_placeholder")}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors">
                        {loading ? t("auth.login.logging_in") : t("auth.login.login_button")}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm">
                        <span className="text-[var(--brand-primary)] hover:underline cursor-pointer font-medium" onClick={() => navigate(routes.signup)}>
                            {t("auth.login.signup_link")}
                        </span>
                    </p>
                    <p className="text-sm">
                        <span className="text-[var(--brand-primary)] hover:underline cursor-pointer font-medium" onClick={() => navigate(routes.forgotPassword)}>
                            {t("auth.login.forgot_password_link")}
                        </span>
                    </p>
                </div>
            </div>
            </div>
        </>
    );
};
