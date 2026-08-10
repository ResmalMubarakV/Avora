import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Wand2, Loader2, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { askAI } from "../../api/aiApi";

// ==========================================
// MEMORY AI STORY ASSISTANT MODAL
// ==========================================
const MemoryAIModal = ({ open, onClose, onApply }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  if (!open) return null;

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US"; // Change to "ml-IN" if you want to speak in Malayalam!

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setPrompt((prev) => prev + " " + transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        toast.error("Microphone error. Please try typing.");
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setPrompt(""); // Clear previous text or keep it depending on preference
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Listening... Speak now!");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleGenerate = async () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    if (!prompt.trim()) {
      toast.error("Please enter or record a brief description of your trip.");
      return;
    }

    try {
      setLoading(true);

      const narrativeblueprints = [
        `BLUEPRINT A (Start at the End): Start the story right at the very end—sitting late at night over food back home, looking back at how crazy the journey was. Then recount the trip as a flashback.`,
        `BLUEPRINT B (Start Mid-Journey): Start the story right in the middle of the action—standing at a scenic spot or having tea. Then weave in how you got there from the departure.`,
        `BLUEPRINT C (Chronological & Casual): Start directly with the departure time and setting off on the road. Keep it moving fast through the stops and wrap up with the return home.`,
        `BLUEPRINT D (Focus on the Road & Vibe): Start the story by focusing on the feeling of being in the car on the way. Let the narrative flow naturally through the spots visited.`
      ];
      
      const randomBlueprint = narrativeblueprints[Math.floor(Math.random() * narrativeblueprints.length)];

      const aiPrompt = `Write a clean, natural, and engaging travel journal story based strictly on these details provided by the user: "${prompt}". 
      
      MANDATORY STRUCTURAL FORMAT:
      - ${randomBlueprint}
      
      CORE RULES:
      1. Stick strictly to the exact facts, places, timeline, and names provided in the user's prompt. Do not invent or add fictional events or people.
      2. Write in a human, realistic, and conversational tone (all-age friendly). Completely avoid overly flowery, cliché, or overly poetic AI language. 
      3. Keep sentence structures varied, natural, and easy to read. Do not use hashtags.`;

      const generatedStory = await askAI(aiPrompt);

      if (!generatedStory) {
        throw new Error("Empty response from AI");
      }

      onApply(generatedStory);
      toast.success("Unique story generated successfully!");
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
              <h3 className="text-base font-bold text-slate-900">Avora AI Storyteller</h3>
              <p className="text-xs text-slate-500">Type or speak your travel details</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isRecording && recognitionRef.current) recognitionRef.current.stop();
              onClose();
            }}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="py-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                What happened during your trip?
              </label>

              {/* Voice Record Toggle Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm cursor-pointer ${
                  isRecording 
                    ? "bg-rose-500 text-white animate-pulse shadow-rose-500/30" 
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                <span>{isRecording ? "Listening..." : "Record Voice"}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="Click 'Record Voice' and speak freely about your trip, or type it here..."
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
              onClick={() => {
                if (isRecording && recognitionRef.current) recognitionRef.current.stop();
                onClose();
              }}
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
                  <span>Drafting Story...</span>
                </>
              ) : (
                <>
                  <Wand2 size={16} />
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