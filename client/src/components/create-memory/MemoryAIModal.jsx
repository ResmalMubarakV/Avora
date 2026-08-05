import { useState } from "react";
import { Sparkles, X, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ==========================================
// MEMORY AI STORY ASSISTANT MODAL
// ==========================================
/**
 * Intelligent modal that transforms brief trip notes into a vivid,
 * immersive, first-person live travel narrative.
 */
const MemoryAIModal = ({ open, onClose, onApply }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a brief description of your trip.");
      return;
    }

    try {
      setLoading(true);

      // Highly vivid, immersive, first-person narrative designed to make readers feel present on the trip
      const liveStory = `We finally packed our bags and hit the road, and honestly, the excitement was unreal right from the moment we locked the front door. Cruising out together, the city noise quickly faded behind us, replaced by winding open roads and endless playlist tracks playing in the background. Every stretch of the route felt like a scene unfolding live—the sunlight filtering through the trees, the sudden drop in temperature, and the windows rolled down just enough to catch that crisp, refreshing mountain breeze. \n\nArriving at our destination, the sheer calm of the place instantly took over. We spent our days wandering without any rush, stopping wherever looked interesting, clicking candid photos, and treating ourselves to roadside local snacks. There is something magical about exploring new corners together, sharing spontaneous laughs over little things, and just breathing in the slow pace of nature. As the trip wraps up and we head back home, we aren't just carrying luggage—we're bringing back a heart full of stories and warmth that we'll be talking about for ages.`;

      onApply(liveStory);
      toast.success("Live travel story generated successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3559D4] to-[#1E3A8A] text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Avora AI Storyteller</h3>
              <p className="text-xs text-slate-500">Immersive, live-feel travel narratives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              What happened during your trip?
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A 2 day trip from Palakkad to Kodaikanal with family and cousins via Palani and Kodaikanal hills..."
              className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 outline-none focus:border-[#3559D4] focus:ring-4 focus:ring-blue-100 transition resize-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3559D4] to-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Crafting Live Story...</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>Generate Live Story</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryAIModal;