import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { askAI } from "../../api/aiApi";
import AvoraAIIcon from "../common/AvoraAIIcon";

// ==========================================
// MEMORY AI STORY ASSISTANT MODAL
// ==========================================
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

      const aiPrompt = `Write a detailed travel journey story based strictly on these details provided by the user: "${prompt}". 
      
      MANDATORY FORMAT & TIMELINE STRUCTURE:
      - The story MUST start strictly at the very beginning of the trip (the initial departure, boarding, or starting point on day one). Do not start in the middle or at the end.
      - Follow a strict chronological order moving forward day-by-day through the events, activities, and ending with the final return home.
      - Expand the story into exactly 5 to 6 well-developed paragraphs.
      
      CORE RULES:
      1. Stick strictly to the exact facts, places, timeline, vehicles, and details provided by the user. Do not invent or add fictional events, unmentioned activities, or unmentioned people.
      2. Write in a human, realistic, and conversational journal style (all-age friendly). Avoid overly flowery, cliché, or overly poetic AI language. 
      3. Keep sentence structures varied, natural, and easy to read. Do not use hashtags.`;

      const generatedStory = await askAI(aiPrompt);

      if (!generatedStory) {
        throw new Error("Empty response from AI");
      }

      onApply(generatedStory);
      toast.success("Detailed journey story generated successfully!");
      setPrompt("");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && prompt.trim()) {
        handleGenerate();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#4F46E5] text-white shadow-md border border-white/20">
              <AvoraAIIcon size={20} variant="current" className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Avora AI Story Generator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Transform your trip notes into a detailed chronicle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Describe your travel journey
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="e.g., A weekend road trip with friends to the hills, exploring scenic viewpoints, local food spots, and heading back home..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-[#3559D4] dark:focus:border-indigo-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-indigo-950/50 transition resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Press <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Enter</kbd> to generate
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] via-[#3559D4] to-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Crafting Journey...</span>
                </>
              ) : (
                <>
                  <AvoraAIIcon size={16} variant="current" className="text-cyan-200" />
                  <span>Generate Story</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryAIModal;