import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";

import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import api from "../../api/axios";

import avoraLogo from "../../assets/images/avoraLogo.png";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        try {

            setLoading(true);

            const { data } = await api.post(
                "/api/auth/forgot-password",
                {
                    email,
                }
            );

            setSuccess(data.message);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <div
                className="
                    w-full
                    rounded-3xl
                    border
                    border-white/60
                    bg-white/90
                    backdrop-blur-xl
                    shadow-[0_25px_60px_rgba(15,23,42,0.15)]
                    px-10
                    py-8
                "
            >

                <div className="flex flex-col items-center">

                    <img
                        src={avoraLogo}
                        alt="Avora"
                        className="h-14"
                    />

                    <h1 className="mt-5 text-3xl font-semibold">

                        Forgot Password

                    </h1>

                    <p className="mt-2 text-center text-slate-500">

                        Enter your email address and we'll send you a password reset link.

                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >

                    <InputField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        icon={<FiMail size={20} />}
                        placeholder="Enter your email"
                        required
                    />

                    {success && (

                        <div
                            className="
                                rounded-xl
                                border
                                border-green-200
                                bg-green-50
                                px-4
                                py-3
                            "
                        >

                            <p className="text-sm text-green-700">

                                {success}

                            </p>

                        </div>

                    )}

                    {error && (

                        <div
                            className="
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                            "
                        >

                            <p className="text-sm text-red-600">

                                {error}

                            </p>

                        </div>

                    )}

                    <PrimaryButton
                        loading={loading}
                    >

                        Send Reset Link

                    </PrimaryButton>

                    <div className="text-center">

                        <Link
                            to="/login"
                            className="
                                text-sm
                                font-medium
                                text-blue-600
                                hover:text-blue-700
                            "
                        >

                            ← Back to Login

                        </Link>

                    </div>

                </form>

            </div>

        </AuthLayout>

    );

};

export default ForgotPassword;