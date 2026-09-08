import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ==========================================
// MARKDOWN RENDERER COMPONENT
// ==========================================
/**
 * Formats and renders AI responses and markdown content using `react-markdown` 
 * and `remark-gfm` with enhanced modern typography, generous line spacing, 
 * beautiful custom bullet styling, and clean block structures.
 */
const MarkdownRenderer = ({ content }) => {
  return (
    <div
      className="
        prose
        prose-slate
        dark:prose-invert
        max-w-none
        break-words
        text-xs sm:text-[15px]
        leading-relaxed sm:leading-[1.8]

        /* Headings spacing & styling */
        prose-headings:scroll-mt-20
        prose-headings:font-bold
        prose-headings:tracking-tight
        prose-headings:text-slate-900
        dark:prose-headings:text-white
        prose-h1:text-lg sm:prose-h1:text-2xl
        prose-h1:mb-2 sm:prose-h1:mb-4
        prose-h1:mt-3 sm:prose-h1:mt-6
        prose-h2:text-base sm:prose-h2:text-xl
        prose-h2:mb-2 sm:prose-h2:mb-3
        prose-h2:mt-2.5 sm:prose-h2:mt-5
        prose-h3:text-sm sm:prose-h3:text-lg
        prose-h3:mb-1.5 sm:prose-h3:mb-2.5
        prose-h3:mt-2 sm:prose-h3:mt-4

        /* Paragraph spacing for better breathing room */
        prose-p:my-2 sm:prose-p:my-3.5
        prose-p:text-slate-700
        dark:prose-p:text-slate-200
        prose-p:leading-relaxed sm:prose-p:leading-[1.8]

        /* Strong text */
        prose-strong:font-semibold
        prose-strong:text-slate-900
        dark:prose-strong:text-white

        /* Lists spacing & item padding */
        prose-ul:my-2 sm:prose-ul:my-4
        prose-ul:pl-4 sm:prose-ul:pl-6
        prose-ol:my-2 sm:prose-ol:my-4
        prose-ol:pl-4 sm:prose-ol:pl-6
        prose-li:my-1 sm:prose-li:my-2
        prose-li:leading-relaxed sm:prose-li:leading-[1.7]
        prose-li:text-slate-700
        dark:prose-li:text-slate-200
        prose-li:marker:text-[#3559D4]
        dark:prose-li:marker:text-indigo-400

        /* Links */
        prose-a:font-medium
        prose-a:text-[#3559D4]
        dark:prose-a:text-indigo-400
        prose-a:no-underline
        hover:prose-a:underline

        /* Horizontal rule */
        prose-hr:my-4 sm:prose-hr:my-8
        prose-hr:border-slate-200
        dark:prose-hr:border-slate-800

        /* Inline code */
        prose-code:rounded-md
        prose-code:bg-blue-50
        dark:prose-code:bg-slate-800
        prose-code:px-1.5 sm:prose-code:px-2
        prose-code:py-0.5 sm:prose-code:py-1
        prose-code:text-xs sm:prose-code:text-sm
        prose-code:font-semibold
        prose-code:text-[#3559D4]
        dark:prose-code:text-indigo-300
        prose-code:before:content-none
        prose-code:after:content-none

        /* Code blocks */
        prose-pre:my-3 sm:prose-pre:my-6
        prose-pre:overflow-x-auto
        prose-pre:rounded-xl sm:prose-pre:rounded-2xl
        prose-pre:bg-slate-900
        prose-pre:p-3 sm:prose-pre:p-6
        prose-pre:shadow-xl
        prose-pre:before:hidden
        prose-pre:after:hidden

        /* Blockquotes */
        prose-blockquote:my-2.5 sm:prose-blockquote:my-5
        prose-blockquote:rounded-r-xl sm:prose-blockquote:rounded-r-2xl
        prose-blockquote:border-l-4
        prose-blockquote:border-[#3559D4]
        dark:prose-blockquote:border-indigo-500
        prose-blockquote:bg-blue-50/60
        dark:prose-blockquote:bg-indigo-950/40
        prose-blockquote:py-2 sm:prose-blockquote:py-3.5
        prose-blockquote:pr-3 sm:prose-blockquote:pr-5
        prose-blockquote:pl-3 sm:prose-blockquote:pl-5
        prose-blockquote:italic
        prose-blockquote:text-slate-700
        dark:prose-blockquote:text-slate-200

        /* Tables spacing */
        prose-table:my-2.5 sm:prose-table:my-5
        prose-table:block
        prose-table:overflow-x-auto
        prose-table:border-collapse
        prose-th:border
        prose-th:border-slate-200
        dark:prose-th:border-slate-700
        prose-th:bg-slate-100
        dark:prose-th:bg-slate-800
        prose-th:px-3 sm:prose-th:px-5
        prose-th:py-1.5 sm:prose-th:py-3
        prose-th:text-left
        prose-th:font-semibold
        prose-td:border
        prose-td:border-slate-200
        dark:prose-td:border-slate-700
        prose-td:px-3 sm:prose-td:px-5
        prose-td:py-1.5 sm:prose-td:py-3

        /* Images */
        prose-img:my-3 sm:prose-img:my-6
        prose-img:rounded-xl sm:prose-img:rounded-2xl
        prose-img:shadow-xl
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;