import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

import api from "../../api/axios";
import AuthLayout from "../../layouts/AuthLayout";

import avoraLogo from "../../assets/images/avoraLogo.png";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";

const Login = () => {

    // State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Functions
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const { data } = await api.post("/api/auth/login", {
                email,
                password,
            });

            if (rememberMe) {
                localStorage.setItem("token", data.token);
            } else {
                sessionStorage.setItem("token", data.token);
            }

            navigate("/dashboard", {
                    replace: true,
                });

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to sign in. Please check your credentials."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <AuthLayout>

            <div className="
                            w-full
                            rounded-3xl
                            border
                            border-white/60
                            bg-white/90
                            backdrop-blur-xl
                            shadow-[0_25px_60px_rgba(15,23,42,0.15)]
                            px-10
                            py-8
                            ">

                {/* Header */}
                <div className="flex flex-col items-center">

                    <img
                        src={avoraLogo}
                        alt="Avora"
                        className="h-16 w-auto select-none"
                        draggable={false}
                    />

                    <h1 className="mt-6 text-4xl font-semibold text-slate-900">
                        Welcome Back
                    </h1>

                    <p className="mt-2 max-w-xs text-center text-slate-500">
                        Sign in to continue your travel journey.
                    </p>

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-10 space-y-6"
                >

                    <InputField
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<FiMail size={20} />}
                        required
                        disabled={loading}
                    />

                    <PasswordField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <div className="flex items-center justify-between">

                        {/* Remember Me */}
                        <label className="flex cursor-pointer items-center gap-2">

                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="
                                    h-4
                                    w-4
                                    rounded
                                    border-slate-300
                                    text-blue-600
                                    focus:ring-blue-500
                                "
                            />

                            <span className="text-sm text-slate-600">
                                Remember Me
                            </span>

                        </label>

                        {/* Forgot Password */}
                        <button
                            type="button"
                            disabled
                            className="cursor-not-allowed text-sm font-medium text-slate-400"
                        >
                            Forgot Password
                        </button>

                    </div>

                    {error && (

                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                            <p className="text-sm text-red-600">
                                {error}
                            </p>

                        </div>

                    )}

                    <PrimaryButton
                        type="submit"
                        loading={loading}
                    >
                        Sign In
                    </PrimaryButton>

                    <div className="text-center">

                        <p className="mt-2 max-w-xs text-center text-slate-500">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                Create Account
                            </Link>

                        </p>

                    </div>

                </form>

            </div>

        </AuthLayout>
    );
};

export default Login;