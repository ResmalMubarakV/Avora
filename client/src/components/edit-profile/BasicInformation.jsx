import {
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";

// ==========================================
// BASIC INFORMATION COMPONENT (COMPACT)
// ==========================================
/**
 * Renders compact basic user profile input fields with validation status indicators.
 */
const BasicInformation = ({
  formData,
  handleChange,
  usernameStatus,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs">
      {/* Section Header */}
      <div className="mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">
          Basic Information
        </h2>
        <p className="text-[11px] text-slate-500">
          Update your personal details.
        </p>
      </div>

      <div className="grid gap-3">
        {/* Full Name Input */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-[11px] font-semibold text-slate-700"
          >
            Full Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm outline-none transition focus:border-[#3559D4] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Username Input with Validation Status */}
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-[11px] font-semibold text-slate-700"
          >
            Username
          </label>

          <div className="relative">
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Choose a unique username"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-9 text-xs sm:text-sm lowercase outline-none transition focus:border-[#3559D4] focus:ring-2 focus:ring-blue-100"
            />

            {/* Status Indicator Icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {usernameStatus === "checking" && (
                <Loader2 size={14} className="animate-spin text-slate-400" />
              )}

              {usernameStatus === "available" && (
                <CheckCircle2 size={14} className="text-emerald-500" />
              )}

              {usernameStatus === "taken" && (
                <XCircle size={14} className="text-red-500" />
              )}
            </div>
          </div>

          {/* Status Message Feedback */}
          {usernameStatus === "checking" && (
            <p className="mt-1 text-[10px] text-slate-500">
              Checking username...
            </p>
          )}

          {usernameStatus === "available" && (
            <p className="mt-1 text-[10px] text-emerald-600">
              Username is available.
            </p>
          )}

          {usernameStatus === "taken" && (
            <p className="mt-1 text-[10px] text-red-600">
              Username is already taken.
            </p>
          )}
        </div>

        {/* Location Input */}
        <div>
          <label
            htmlFor="location"
            className="mb-1 block text-[11px] font-semibold text-slate-700"
          >
            Location
          </label>

          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State or Country"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm outline-none transition focus:border-[#3559D4] focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
};

BasicInformation.displayName = "BasicInformation";
export default BasicInformation;