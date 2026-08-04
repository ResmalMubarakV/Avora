import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../../layouts/AuthLayout";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import PasswordStrength from "../../components/auth/PasswordStrength";

import api from "../../api/axios";

import avoraLogo from "../../assets/images/avoraLogo.png";

const ResetPassword = () => {

    const { token } = useParams();

    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            const { data } = await api.post(

                `/api/auth/reset-password/${token}`,

                {
                    password,
                }

            );

            toast.success(data.message);

            navigate("/login", {
                replace: true,
            });

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

                        Reset Password

                    </h1>

                    <p className="mt-2 text-center text-slate-500">

                        Enter your new password below.

                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >

                    <PasswordField
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    {password && (
                        <PasswordStrength password={password} />
                    )}

                    <PasswordField
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />

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

                        Reset Password

                    </PrimaryButton>

                    <div className="text-center">

                        <Link
                            to="/login"
                            className="
                                text-sm
                                text-blue-600
                                hover:text-blue-700
                            "
                        >

                            Back to Login

                        </Link>

                    </div>

                </form>

            </div>

        </AuthLayout>

    );

};

export default ResetPassword;