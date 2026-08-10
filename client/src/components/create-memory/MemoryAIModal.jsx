import { useState } from "react";
import { Sparkles, X, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { askAI } from "../../api/aiApi";

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

      const narrativeBlueprints = [
        `BLUEPRINT A (Chronological & Detailed): Start directly with the morning departure, moving step-by-step chronologically through the journey, activities, and final return.`,
        `BLUEPRINT B (Start Mid-Journey): Begin the story right in the middle of exploring the main destination or landmark, then unfold the details through a natural sequence.`,
        `BLUEPRINT C (Road & Movement Focus): Start by focusing on the feeling of setting off on the road, following the natural timeline forward from day one to the end.`
      ];
      
      const randomBlueprint = narrativeBlueprints[Math.floor(Math.random() * narrativeBlueprints.length)];

      const aiPrompt = `Write a detailed travel journey story based strictly on these details provided by the user: "${prompt}". 
      
      MANDATORY FORMAT & LENGTH:
      - Expand the story into exactly 5 to 6 well-developed paragraphs.
      - ${randomBlueprint}
      
      CORE RULES:
      1. Stick strictly to the exact facts, places, timeline, vehicles, and details provided by the user. Do not invent or add fictional events, unmentioned activities, or unmentioned people.
      2. Write in a human, realistic, and conversational tone (all-age friendly). Avoid overly flowery, cliché, or overly poetic AI language. 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3559D4] to-[#1E3A8A] text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Avora AI Travel Journey</h3>
              <p className="text-xs text-slate-500">Transform your trip notes into a detailed story</p>
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
              Describe your travel journey
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="e.g., A weekend road trip with friends to the hills, exploring scenic viewpoints, local food spots, and heading back home..."
              className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 outline-none focus:border-[#3559D4] focus:ring-4 focus:ring-blue-100 transition resize-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium">
            Press <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-600">Enter</kbd> to generate
          </p>
          <div className="flex items-center gap-3">
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
                  <span>Crafting Journey...</span>
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  <span>Generate Journey</span>
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