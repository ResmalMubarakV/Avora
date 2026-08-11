import { Globe, Lock } from "lucide-react";

const VisibilityCard = ({ formData, setFormData }) => {
  const toggleVisibility = () => {
    setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const isPublic = formData.isPublic ?? true;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${isPublic ? "bg-blue-100 text-[#3559D4]" : "bg-slate-100 text-slate-500"}`}>
            {isPublic ? <Globe size={18} /> : <Lock size={18} />}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">Visibility</h2>
            <p className="text-xs text-slate-500">
              {isPublic ? "Anyone can view this memory." : "Only you can view this memory."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleVisibility}
          className={`relative h-7 w-12 rounded-full transition-all duration-300 cursor-pointer ${!isPublic ? "bg-slate-900" : "bg-slate-300"}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${!isPublic ? "left-6" : "left-1"}`} />
        </button>
      </div>
    </div>
  );
};

export default VisibilityCard;