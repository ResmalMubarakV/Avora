import { useState, useMemo } from "react";
import { KeyRound, ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff, ShieldAlert, Check, X, HelpCircle, Lock, ArrowLeft } from "lucide-react";
import { updateUserPassword } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageTitle from "../../components/common/PageTitle";

const SecuritySettings = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validations = useMemo(() => ({
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]/.test(newPassword),
  }), [newPassword]);

  const isPasswordStrong = Object.values(validations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isPasswordStrong) {
      setError("Please fulfill all security requirements for your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const data = await updateUserPassword({ currentPassword, newPassword });
      setSuccess(data.message || "Password updated successfully. Logging out...");
      toast.success("Password updated successfully. Please log in again.");
      
      setTimeout(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-300 px-3 sm:px-0">
      <PageTitle title="Security Settings" />

      {/* Back Button Navigation Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2541b2] p-6 sm:p-10 shadow-xl border border-blue-400/20 text-white">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-400/15 blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-inner text-white">
              <Lock size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Security Settings</h1>
              <p className="text-xs sm:text-sm text-blue-100/80 font-medium">Manage your password and safeguard your account access.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-2.5 text-xs font-bold text-blue-100 backdrop-blur-md transition cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <HelpCircle size={15} className="text-blue-300" /> Forgot Current Password?
          </button>
        </div>
      </div>

      {/* Main Form Card Container */}
      <div className="rounded-[28px] sm:rounded-[32px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-xs sm:text-sm font-semibold text-emerald-700 animate-in fade-in">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-xs sm:text-sm font-semibold text-red-600 animate-in fade-in">
            <ShieldAlert size={20} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Current Password Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label="Toggle Current Password Visibility"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter secure new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  aria-label="Toggle New Password Visibility"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle Confirm Password Visibility"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

          </div>

          {/* Password Security Checklist Box */}
          {newPassword && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Password Security Checklist:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className={`flex items-center gap-2 font-semibold transition-colors ${validations.length ? "text-emerald-600" : "text-slate-400"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${validations.length ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                    {validations.length ? <Check size={12} /> : <X size={12} />}
                  </span>
                  At least 8 characters long
                </div>
                <div className={`flex items-center gap-2 font-semibold transition-colors ${validations.uppercase ? "text-emerald-600" : "text-slate-400"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${validations.uppercase ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                    {validations.uppercase ? <Check size={12} /> : <X size={12} />}
                  </span>
                  One uppercase letter (A-Z)
                </div>
                <div className={`flex items-center gap-2 font-semibold transition-colors ${validations.lowercase ? "text-emerald-600" : "text-slate-400"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${validations.lowercase ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                    {validations.lowercase ? <Check size={12} /> : <X size={12} />}
                  </span>
                  One lowercase letter (a-z)
                </div>
                <div className={`flex items-center gap-2 font-semibold transition-colors ${validations.number ? "text-emerald-600" : "text-slate-400"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${validations.number ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                    {validations.number ? <Check size={12} /> : <X size={12} />}
                  </span>
                  One numeric digit (0-9)
                </div>
                <div className={`flex items-center gap-2 font-semibold transition-colors ${validations.special ? "text-emerald-600" : "text-slate-400"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${validations.special ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                    {validations.special ? <Check size={12} /> : <X size={12} />}
                  </span>
                  One special symbol (@$!%*?&)
                </div>
              </div>
            </div>
          )}

          {/* Form Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || !isPasswordStrong}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#1E3A8A] px-8 py-4 text-xs sm:text-sm font-extrabold text-white shadow-[0_10px_25px_-5px_rgba(30,58,138,0.3)] transition-all duration-300 hover:bg-[#3559D4] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Updating & Securing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Update Password & Re-login</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default SecuritySettings;