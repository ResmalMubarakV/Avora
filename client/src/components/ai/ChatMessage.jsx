import {
    Bot,
    Sparkles,
    Copy,
    RotateCcw,
    Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import MarkdownRenderer from "./MarkdownRenderer";
import SuggestionChips from "./SuggestionChips";

const ChatMessage = ({
    role,
    content,
    timestamp,
    onSuggestion,
    onRegenerate,
    isLastAssistantMessage,
    loading,
}) => {

    const [copied, setCopied] = useState(false);

    const isUser = role === "user";

    const formattedTime = timestamp
        ? new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

    const copyMessage = async () => {

        await navigator.clipboard.writeText(content);

        setCopied(true);

        toast.success("Copied to clipboard.");

        setTimeout(() => {

            setCopied(false);

        }, 2000);

    };

    if (isUser) {

        return (

            <div className="flex justify-end">

                <div
                    className="
                        max-w-2xl
                        rounded-[28px]
                        rounded-br-md
                        bg-gradient-to-r
                        from-[#3559D4]
                        to-[#1E3A8A]
                        px-6
                        py-4
                        text-white
                        shadow-lg
                    "
                >

                    <p className="whitespace-pre-wrap leading-7">

                        {content}

                    </p>

                    <p
                        className={`
                            mt-3
                            text-xs
                            ${
                                isUser
                                    ? "text-blue-100 text-right"
                                    : "text-slate-400"
                            }
                        `}>
                        {formattedTime}
                    </p>

                </div>

            </div>

        );

    }

    return (

        <div
            className="
                flex
                items-start
                gap-4
            "
        >

            {/* Avatar */}

            <div
                className="
                    relative
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-[#3559D4]
                    to-[#1E3A8A]
                    text-white
                    shadow-lg
                "
            >

                <Bot size={22} />

                <span
                    className="
                        absolute
                        -right-1
                        -top-1
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-[#3559D4]
                        shadow
                    "
                >

                    <Sparkles size={10} />

                </span>

            </div>

            {/* Message */}

            <div className="flex-1">

                <div className="mb-2 text-sm font-semibold text-slate-900">

                    Avora AI

                </div>

                <MarkdownRenderer
                    content={content}
                />

                <p
                    className={`
                        mt-3
                        text-xs
                        ${
                            isUser
                                ? "text-blue-100 text-right"
                                : "text-slate-400"
                        }
                    `}>
                    {formattedTime}
                </p>

                {/* Actions */}

                <div
                    className="
                        mt-6
                        flex
                        items-center
                        gap-3
                    "
                >

                    <button
                        onClick={copyMessage}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            px-3
                            py-2
                            text-sm
                            hover:bg-slate-100
                        "
                    >

                        {copied
                            ? <Check size={16} />
                            : <Copy size={16} />
                        }

                        {copied
                            ? "Copied"
                            : "Copy"
                        }

                    </button>

                    {isLastAssistantMessage && (

                        <button
                            onClick={onRegenerate}
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                px-3
                                py-2
                                text-sm
                                hover:bg-slate-100
                            "
                        >

                            <RotateCcw size={16} />

                            Regenerate

                        </button>

                    )}

                </div>

                {isLastAssistantMessage && (

                    <SuggestionChips
                        onSelect={onSuggestion}
                        loading={loading}
                    />

                )}

            </div>

        </div>

    );

};

export default ChatMessage;