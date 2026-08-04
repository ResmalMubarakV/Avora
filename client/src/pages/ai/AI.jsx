import { useRef, useEffect } from "react";

import AIHeader from "../../components/ai/AIHeader";
import AIConversation from "../../components/ai/AIConversation";
import ChatInput from "../../components/ai/ChatInput";

import useAI from "../../hooks/useAI";

const AI = () => {

    const {
    messages,
    loading,
    sendMessage,
    newChat,
    regenerate,
    conversationTitle,
} = useAI();

    const inputRef = useRef(null);

    useEffect(() => {

        if (!loading) {

            inputRef.current?.focus();

        }

    }, [loading]);

    return (

        <main
            className="
                relative
                flex
                h-full
                flex-col
                overflow-hidden

                bg-slate-50
            "
        >

            {/* Background */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div
                    className="
                        absolute
                        -left-24
                        -top-24
                        h-96
                        w-96
                        rounded-full
                        bg-blue-200/30
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        bottom-0
                        right-0
                        h-[32rem]
                        w-[32rem]
                        rounded-full
                        bg-indigo-200/30
                        blur-3xl
                    "
                />

            </div>

            {/* Content */}

            <div className="relative z-10 flex h-full flex-col">

                <AIHeader
                    title={conversationTitle}
                    onNewChat={newChat}
                />

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-6
                    "
                >

                    <AIConversation
                        messages={messages}
                        loading={loading}
                        onSuggestionClick={sendMessage}
                        onRegenerate={regenerate}
                    />

                </div>

                <ChatInput
                    ref={inputRef}
                    loading={loading}
                    onSend={sendMessage}
                />

            </div>

        </main>

    );

};

export default AI;