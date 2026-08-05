import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

import api from "../../api/axios";
import AuthLayout from "../../layouts/AuthLayout";
import avoraLogo from "../../assets/images/avoraLogo.png";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";

// ==========================================
// LOGIN PAGE COMPONENT
// ==========================================
/**
 * Handles user authentication via email and password.
 * Manages form state, token storage, error handling, and redirection 
 * based on account status and user role.
 */
const Login = () => {
  // --- Component State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/auth/login", {
        email,
        password,
      });

      // Save token and user role to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);

      // Redirect based on whether they are an admin or a regular user
      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      const { code, message } = err.response?.data || {};

      // Handle restricted account statuses
      if (code === "ACCOUNT_PENDING") {
        navigate("/pending", { replace: true });
        return;
      }

      if (code === "ACCOUNT_SUSPENDED") {
        navigate("/suspended", { replace: true });
        return;
      }

      setError(message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_25px_60px_rgba(15,23,42,0.15)] px-10 py-8">
        {/* Header Section */}
        <div className="flex flex-col items-center">
          <img
            src={avoraLogo}
            alt="Avora"
            className="h-16 w-auto select-none"
            draggable={false}
          />
          <h1 className="mt-6 text-4xl font-semibold text-slate-900">Welcome Back</h1>
          <p className="mt-2 max-w-xs text-center text-slate-500">
            Sign in to continue your travel journey.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
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

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-slate-700 hover:text-slate-900"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error Message Banner */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <PrimaryButton type="submit" loading={loading}>
            Sign In
          </PrimaryButton>

          {/* Registration Redirect */}
          <div className="text-center">
            <p className="mt-2 max-w-xs text-center text-blue-900">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-700 transition-colors hover:text-blue-900"
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