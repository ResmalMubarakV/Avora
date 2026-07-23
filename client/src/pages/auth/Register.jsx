import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiAtSign } from "react-icons/fi";

import api from "../../api/axios";
import AuthLayout from "../../layouts/AuthLayout";

import avoraLogo from "../../assets/images/avoraLogo.png";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import ValidationMessage from "../../components/ui/ValidationMessage";

const Register = () => {
    // State
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailStatus, setEmailStatus] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [usernameStatus, setUsernameStatus] = useState("");
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [passwordStatus, setPasswordStatus] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isFormValid) {
            setError("Please complete all required fields correctly.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/api/auth/register", {
                name,
                username,
                email,
                password,
            });
            navigate("/pending-approval", {
                        replace: true,
                        state: {
                    registrationSuccess: true,
                },

                    });
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const checkUsernameAvailability = async (username) => {

        if (username.trim().length < 3) {
            setUsernameStatus("");
            return;
        }

        try {
            setCheckingUsername(true);
            const { data } = await api.get(
                "/api/users/check-username",
                {
                    params: {
                        username,
                    },
                }
            );
            if (data.available) {
                setUsernameStatus("available");
            } else {
                setUsernameStatus("taken");
            }
        } catch (error) {
            setUsernameStatus("");
        } finally {
            setCheckingUsername(false);
        }
    };

    useEffect(() => {

       if (username.trim().length < 3) {
            setUsernameStatus("");
            return;
        }
        const timer = setTimeout(() => {
            checkUsernameAvailability(username);
        }, 500);
        return () => clearTimeout(timer);
    }, [username]);


    useEffect(() => {

        if (!confirmPassword) {
            setPasswordStatus("");
            return;
        }
        if (password === confirmPassword) {
            setPasswordStatus("match");
        } else {
            setPasswordStatus("mismatch");
        }
    }, [password, confirmPassword]);


    useEffect(() => {

        if (!email.trim()) {
            setEmailStatus("");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(email)) {
            setEmailStatus("valid");
        } else {
            setEmailStatus("invalid");
        }
    }, [email]);

    const isFormValid =
    name.trim() &&
    username.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    usernameStatus === "available" &&
    passwordStatus === "match" &&
    emailStatus === "valid";

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
                        className="h-14 w-auto select-none"
                        draggable={false}
                    />

                    <h1 className="mt-4 text-3xl font-semibold text-slate-900">
                        Create Account
                    </h1>

                    <p className="mt-2 max-w-xs text-center text-slate-500">
                        Start preserving your travel memories today.
                    </p>

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >

                    <InputField
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        icon={<FiUser size={20} />}
                        required
                        disabled={loading}
                    />

                    <InputField
                        label="Username"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={<FiAtSign size={20} />}
                        required
                        disabled={loading}
                    />
                    {checkingUsername && (
                        <p className="text-xs text-slate-500">
                            Checking username...
                        </p>
                    )}

                    {!checkingUsername && usernameStatus === "available" && (
                        <p className="text-xs text-green-600">
                            ✓ Username available
                        </p>
                    )}

                    {!checkingUsername && usernameStatus === "taken" && (
                        <p className="text-xs text-red-500">
                            Username already exists
                        </p>
                    )}

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

                    <ValidationMessage
                        status={emailStatus}
                        success="✓ Valid email address"
                        error="Please enter a valid email address"
                    />

                    <PasswordField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <PasswordField
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        />

                        
                    <ValidationMessage
                        status={passwordStatus}
                        success="✓ Passwords match"
                        error="Passwords do not match"
                    />

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
                        disabled={loading || !isFormValid}
                    >
                        Create Account
                    </PrimaryButton>

                    <div className="pt-1 text-center">

                        <p className="mt-2 max-w-xs text-center text-slate-500">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                Sign In
                            </Link>

                        </p>

                    </div>

                </form>

            </div>

        </AuthLayout>
    );
};

export default Register;