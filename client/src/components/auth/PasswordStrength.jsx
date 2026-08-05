import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ==========================================
// PASSWORD STRENGTH COMPONENT
// ==========================================
/**
 * Evaluates password strength based on standard security rules (length, uppercase, lowercase, 
 * numbers, special characters). Displays a dynamic progress bar, strength indicator label, 
 * and a checklist of validated criteria.
 */
const PasswordStrength = ({ password }) => {
  // --- Password Validation Rules ---
  const rules = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /\d/.test(password),
    },
    {
      label: "One special character",
      valid: /[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]/.test(password),
    },
  ];

  const passedRules = rules.filter((rule) => rule.valid).length;

  // --- Strength Level Calculations ---
  let strength = "Weak";
  let barWidth = "20%";
  let barColor = "bg-red-500";

  if (passedRules === 2) {
    strength = "Fair";
    barWidth = "40%";
    barColor = "bg-orange-500";
  } else if (passedRules === 3 || passedRules === 4) {
    strength = "Good";
    barWidth = "75%";
    barColor = "bg-yellow-500";
  } else if (passedRules === 5) {
    strength = "Strong";
    barWidth = "100%";
    barColor = "bg-green-500";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {/* Header & Strength Label */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">
          Password Strength
        </h3>
        <span
          className={`text-sm font-semibold ${
            strength === "Weak"
              ? "text-red-500"
              : strength === "Fair"
              ? "text-orange-500"
              : strength === "Good"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {strength}
        </span>
      </div>

      {/* Progress Strength Bar */}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: barWidth }}
        />
      </div>

      {/* Validation Rules Checklist */}
      <div className="mt-5 space-y-2">
        {rules.map((rule) => (
          <div key={rule.label} className="flex items-center gap-2 text-sm">
            {rule.valid ? (
              <CheckCircle2 size={17} className="text-green-500 shrink-0" />
            ) : (
              <XCircle size={17} className="text-red-400 shrink-0" />
            )}
            <span className={rule.valid ? "text-green-700 font-medium" : "text-slate-500"}>
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;