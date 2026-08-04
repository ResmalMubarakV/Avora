import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }) => {

    return (

        <div
            className="
                prose
                prose-slate

                max-w-none

                prose-headings:scroll-mt-24
                prose-headings:font-bold
                prose-headings:tracking-tight
                prose-headings:text-slate-900

                prose-h1:text-3xl
                prose-h2:text-2xl
                prose-h3:text-xl

                prose-p:my-4
                prose-p:text-slate-700
                prose-p:leading-8

                prose-strong:font-semibold
                prose-strong:text-slate-900

                prose-ul:my-5
                prose-ol:my-5

                prose-li:my-2
                prose-li:leading-8

                prose-a:font-medium
                prose-a:text-[#3559D4]
                prose-a:no-underline
                hover:prose-a:underline

                prose-hr:my-8

                prose-code:rounded-md
                prose-code:bg-slate-100
                prose-code:px-2
                prose-code:py-1
                prose-code:text-sm
                prose-code:font-medium
                prose-code:text-[#3559D4]

                prose-pre:overflow-x-auto
                prose-pre:rounded-2xl
                prose-pre:bg-slate-900
                prose-pre:p-5
                prose-pre:shadow-lg

                prose-pre:before:hidden
                prose-pre:after:hidden

                prose-blockquote:rounded-r-xl
                prose-blockquote:border-l-4
                prose-blockquote:border-[#3559D4]
                prose-blockquote:bg-blue-50/50
                prose-blockquote:py-2
                prose-blockquote:pl-5
                prose-blockquote:italic
                prose-blockquote:text-slate-700

                prose-table:block
                prose-table:overflow-x-auto
                prose-table:border-collapse

                prose-th:border
                prose-th:border-slate-200
                prose-th:bg-slate-100
                prose-th:px-4
                prose-th:py-3
                prose-th:text-left
                prose-th:font-semibold

                prose-td:border
                prose-td:border-slate-200
                prose-td:px-4
                prose-td:py-3

                prose-img:rounded-2xl
                prose-img:shadow-lg
            "
        >

            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
            >
                {content}
            </ReactMarkdown>

        </div>

    );

};

export default MarkdownRenderer;