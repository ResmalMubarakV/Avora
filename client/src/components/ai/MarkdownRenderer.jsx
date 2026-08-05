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
        max-w-none
        text-[15px]
        leading-[1.8]

        /* Headings spacing & styling */
        prose-headings:scroll-mt-24
        prose-headings:font-bold
        prose-headings:tracking-tight
        prose-headings:text-slate-900
        prose-h1:text-3xl
        prose-h1:mb-6
        prose-h1:mt-8
        prose-h2:text-2xl
        prose-h2:mb-5
        prose-h2:mt-8
        prose-h3:text-xl
        prose-h3:mb-4
        prose-h3:mt-6

        /* Paragraph spacing for better breathing room */
        prose-p:my-5
        prose-p:text-slate-700
        prose-p:leading-[1.8]

        /* Strong text */
        prose-strong:font-semibold
        prose-strong:text-slate-900

        /* Lists spacing & item padding */
        prose-ul:my-6
        prose-ul:pl-6
        prose-ol:my-6
        prose-ol:pl-6
        prose-li:my-3
        prose-li:leading-[1.7]
        prose-li:text-slate-700
        prose-li:marker:text-[#3559D4]

        /* Links */
        prose-a:font-medium
        prose-a:text-[#3559D4]
        prose-a:no-underline
        hover:prose-a:underline

        /* Horizontal rule */
        prose-hr:my-10
        prose-hr:border-slate-200

        /* Inline code */
        prose-code:rounded-md
        prose-code:bg-blue-50
        prose-code:px-2
        prose-code:py-1
        prose-code:text-sm
        prose-code:font-semibold
        prose-code:text-[#3559D4]
        prose-code:before:content-none
        prose-code:after:content-none

        /* Code blocks */
        prose-pre:my-6
        prose-pre:overflow-x-auto
        prose-pre:rounded-2xl
        prose-pre:bg-slate-900
        prose-pre:p-6
        prose-pre:shadow-xl
        prose-pre:before:hidden
        prose-pre:after:hidden

        /* Blockquotes */
        prose-blockquote:my-6
        prose-blockquote:rounded-r-2xl
        prose-blockquote:border-l-4
        prose-blockquote:border-[#3559D4]
        prose-blockquote:bg-blue-50/60
        prose-blockquote:py-4
        prose-blockquote:pr-6
        prose-blockquote:pl-6
        prose-blockquote:italic
        prose-blockquote:text-slate-700

        /* Tables spacing */
        prose-table:my-6
        prose-table:block
        prose-table:overflow-x-auto
        prose-table:border-collapse
        prose-th:border
        prose-th:border-slate-200
        prose-th:bg-slate-100
        prose-th:px-5
        prose-th:py-3.5
        prose-th:text-left
        prose-th:font-semibold
        prose-td:border
        prose-td:border-slate-200
        prose-td:px-5
        prose-td:py-3.5

        /* Images */
        prose-img:my-6
        prose-img:rounded-2xl
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