import { useState } from "react";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { useNavigate } from "react-router-dom";
import { PageSEO } from "../../components/seo/PageSEO";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await resetPassword(email);
        if (error) setError(error.message);
        else setSuccess(true);

        setLoading(false);
    };

    return (
        <>
            <PageSEO titleKey="seo.titles.forgot_password" descriptionKey="seo.descriptions.forgot_password" />
            <div className="h-dvh flex items-center justify-center px-4 bg-[#2d2d2d]">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Reset Password</h2>

                {success ? (
                    <p className="text-green-600 text-center">Controlla la tua email per reimpostare la password.</p>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-gray-100 border border-gray-200 px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? "Invio email..." : "Invia email di reset"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm">
                        <span className="text-indigo-600 hover:underline cursor-pointer font-medium" onClick={() => navigate(routes.login)}>
                            Accedi
                        </span>
                    </p>
                </div>
            </div>
            </div>
        </>
    );
};
