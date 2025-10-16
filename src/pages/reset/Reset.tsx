import { useState } from "react";
import { supabase } from "../../store/supabaseClient";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({ password });
        if (error) setMessage(error.message);
        else setMessage("Password updated! You can now log in.");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleReset} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">Set new password</h2>
                <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full rounded mb-4" />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">Update Password</button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
}
