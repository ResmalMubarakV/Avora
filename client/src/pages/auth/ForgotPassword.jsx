import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Mail, ArrowLeft, Loader2, CheckCircle2, ShieldAlert, Sparkles, ShieldCheck, Send } from "lucide-react";
import { toast } from "sonner";
import api from "../../api/axios";
import { getMyProfile } from "../../api/userApi";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// FORGOT PASSWORD PAGE COMPONENT
// ==========================================
const ForgotPassword = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token") || !!sessionStorage.getItem("token");

  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        try {
          const user = await getMyProfile();
          setCurrentUser(user);
          if (user?.email && user?.username) {
            setEmail(user.email);
            setUsername(user.username);
          }
        } catch {
          // Fallback if fetch fails
        }
      };
      fetchUser();
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!email.trim() || !username.trim()) {
      toast.error("Account details missing.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/forgot-password", {
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
      });

      setSuccess(true);
      toast.success(data.message || "Password reset link sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (isLoggedIn) {
      navigate("/dashboard/settings/security");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 px-4 py-12 overflow-hidden animate-in fade-in duration-500">
      <PageTitle title="Forgot Password" />
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:border-slate-300 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span>{isLoggedIn ? "Back to Security Settings" : "Back to Login"}</span>
          </button>
        </div>

        {/* Modern Glass Card */}
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 backdrop-blur-xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(30,58,138,0.06)] transition-all duration-300">
          
          <div className="text-center space-y-3 mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-[#1E3A8A] text-white shadow-lg shadow-blue-500/25">
              <KeyRound size={28} />
            </div>
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-[#3559D4] border border-blue-100 mb-1">
                <Sparkles size={10} /> {isLoggedIn ? "Verified Session Vault" : "Secure Recovery Vault"}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Reset Password</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                {isLoggedIn 
                  ? "We have verified your active session credentials below. Tap to instantly dispatch your secure recovery token." 
                  : "Enter your registered credentials to generate an encrypted password recovery link."}
              </p>
            </div>
          </div>

          {success ? (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300 py-2">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-6 text-emerald-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="text-sm font-black text-emerald-900">Recovery Link Dispatched!</h2>
                <p className="text-xs leading-relaxed text-emerald-700 font-medium">
                  We have successfully emailed a secure, time-sensitive reset link to your verified address.
                </p>
              </div>
              <button
                type="button"
                onClick={handleBack}
                className="w-full inline-flex items-center justify-center rounded-2xl bg-[#1E3A8A] py-4 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-[#3559D4] active:scale-95 cursor-pointer"
              >
                {isLoggedIn ? "Return to Security Settings" : "Return to Login"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-xs font-semibold text-red-600 animate-in fade-in">
                  <ShieldAlert size={18} className="shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100/80 space-y-3 shadow-inner">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#1E3A8A]">
                      <ShieldCheck size={16} /> Active Session Verified
                    </div>
                    <div className="text-xs text-slate-600 space-y-1.5 bg-white/80 p-3.5 rounded-xl border border-slate-200/60 shadow-sm">
                      <p className="flex justify-between"><span className="font-bold text-slate-500">Username:</span> <span className="font-extrabold text-slate-800">@{currentUser?.username || username || "Loading..."}</span></p>
                      <p className="flex justify-between"><span className="font-bold text-slate-500">Destination Email:</span> <span className="font-extrabold text-slate-800">{currentUser?.email || email || "Loading..."}</span></p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] py-4 text-xs sm:text-sm font-extrabold text-white shadow-[0_10px_25px_-5px_rgba(30,58,138,0.3)] transition-all duration-300 hover:bg-[#3559D4] active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Dispatching Token...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Token to My Email</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">Username</label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 px-4 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100 shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter account email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-4 pr-12 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100 shadow-sm font-medium"
                      />
                      <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] py-4 text-xs sm:text-sm font-extrabold text-white shadow-[0_10px_25px_-5px_rgba(30,58,138,0.3)] transition-all duration-300 hover:bg-[#3559D4] active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Sending Recovery Link...</span>
                        </>
                      ) : (
                        <span>Send Reset Link</span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;