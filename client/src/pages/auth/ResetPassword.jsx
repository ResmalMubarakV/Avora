import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff, ShieldAlert, KeyRound } from "lucide-react";
import { toast } from "sonner";
import api from "../../api/axios";
import PageTitle from "../../components/common/PageTitle";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validations = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]/.test(password),
  }), [password]);

  const isPasswordStrong = Object.values(validations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordStrong) {
      setError("Please fulfill all security requirements for your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post(`/api/auth/reset-password/${token}`, { password });
      
      setSuccess(true);
      toast.success(data.message || "Password reset successfully!");

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "This password reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-3 sm:px-4 py-8 sm:py-12">
      <PageTitle title="Reset Password" />
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="text-center space-y-2 mb-6 sm:mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3559D4] border border-blue-100 shadow-inner">
              <KeyRound size={26} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Create New Password</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Choose a strong password to secure your Avora account.
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center animate-in fade-in">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6 text-emerald-800">
                <CheckCircle2 size={36} className="text-emerald-600 shrink-0" />
                <h2 className="text-sm font-bold">Password Reset Successful!</h2>
                <p className="text-xs leading-relaxed text-emerald-700">
                  Your password has been successfully updated. Redirecting to login...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 sm:py-3.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 sm:py-3.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordStrong}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] py-3.5 sm:py-4 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#3559D4] active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin shrink-0" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} className="shrink-0" />
                    <span>Reset Password & Login</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;