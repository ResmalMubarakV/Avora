import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiUser } from "react-icons/fi";

import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import api from "../../api/axios";

import avoraLogo from "../../assets/images/avoraLogo.png";

// ==========================================
// FORGOT PASSWORD PAGE COMPONENT
// ==========================================
/**
 * Allows users to request a password reset link by submitting their 
 * registered email address and username combination.
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // --- Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/forgot-password", {
        email,
        username,
      });
      setSuccess(data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_25px_60px_rgba(15,23,42,0.15)] px-10 py-8">
        {/* Header Section */}
        <div className="flex flex-col items-center">
          <img src={avoraLogo} alt="Avora" className="h-14" />
          <h1 className="mt-5 text-3xl font-semibold">Forgot Password</h1>
          <p className="mt-2 text-center text-slate-500">
            Enter your email and username to receive a password reset link.
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FiMail size={20} />}
            placeholder="Enter your email"
            required
            disabled={loading}
          />

          <InputField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<FiUser size={20} />}
            placeholder="Enter your username"
            required
            disabled={loading}
          />

          {/* Success Banner */}
          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <PrimaryButton loading={loading}>Send Reset Link</PrimaryButton>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
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