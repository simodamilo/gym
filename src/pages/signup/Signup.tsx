import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { PageSEO } from "../../components/seo/PageSEO";

export const Signup = () => {
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
            <div className="h-dvh flex items-center justify-center px-4 bg-[#2d2d2d]">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Registrati</h2>

                {success ? (
                    <p className="text-green-600 text-center">Registrazione completata! Controlla la tua email per confermare l'account.</p>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-gray-100 border border-gray-200 px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-gray-100 border border-gray-200 px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? "Creazione account..." : "Registrati"}
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
