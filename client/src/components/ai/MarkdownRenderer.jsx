import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ==========================================
// MARKDOWN RENDERER COMPONENT (RESPONSIVE)
// ==========================================
/**
 * Formats and renders AI responses and markdown content using `react-markdown` 
 * and `remark-gfm` with responsive typography, custom table scroll containers,
 * elegant code blocks, and adaptive list spacing across all viewports.
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
        text-sm sm:text-[15px] md:text-base
        leading-relaxed sm:leading-[1.8]

        /* Headings responsive typography */
        prose-headings:scroll-mt-20
        prose-headings:font-bold
        prose-headings:tracking-tight
        prose-headings:text-slate-900
        dark:prose-headings:text-white
        prose-h1:text-lg sm:prose-h1:text-xl md:prose-h1:text-2xl
        prose-h1:mb-2 sm:prose-h1:mb-3 md:prose-h1:mb-4
        prose-h1:mt-3 sm:prose-h1:mt-5
        prose-h2:text-base sm:prose-h2:text-lg md:prose-h2:text-xl
        prose-h2:mb-2 sm:prose-h2:mb-3
        prose-h2:mt-3 sm:prose-h2:mt-4
        prose-h3:text-sm sm:prose-h3:text-base md:prose-h3:text-lg
        prose-h3:mb-1.5 sm:prose-h3:mb-2
        prose-h3:mt-2 sm:prose-h3:mt-3

        /* Paragraphs & Text */
        prose-p:my-2 sm:prose-p:my-3
        prose-p:text-slate-700
        dark:prose-p:text-slate-200
        prose-p:leading-relaxed sm:prose-p:leading-[1.8]

        /* Strong text */
        prose-strong:font-bold
        prose-strong:text-slate-900
        dark:prose-strong:text-white

        /* Lists */
        prose-ul:my-2 sm:prose-ul:my-3
        prose-ul:pl-4 sm:prose-ul:pl-6
        prose-ol:my-2 sm:prose-ol:my-3
        prose-ol:pl-4 sm:prose-ol:pl-6
        prose-li:my-1 sm:prose-li:my-1.5
        prose-li:leading-relaxed sm:prose-li:leading-[1.7]
        prose-li:text-slate-700
        dark:prose-li:text-slate-200
        prose-li:marker:text-[#3559D4]
        dark:prose-li:marker:text-indigo-400

        /* Links */
        prose-a:font-semibold
        prose-a:text-[#3559D4]
        dark:prose-a:text-indigo-400
        prose-a:no-underline
        hover:prose-a:underline

        /* Horizontal rule */
        prose-hr:my-4 sm:prose-hr:my-6
        prose-hr:border-slate-200
        dark:prose-hr:border-slate-800

        /* Inline code */
        prose-code:rounded-md
        prose-code:bg-blue-50/80
        dark:prose-code:bg-slate-800
        prose-code:px-1.5 sm:prose-code:px-2
        prose-code:py-0.5
        prose-code:text-xs sm:prose-code:text-[13px]
        prose-code:font-semibold
        prose-code:text-[#3559D4]
        dark:prose-code:text-indigo-300
        prose-code:before:content-none
        prose-code:after:content-none

        /* Code blocks */
        prose-pre:my-3 sm:prose-pre:my-5
        prose-pre:overflow-x-auto
        prose-pre:rounded-xl sm:prose-pre:rounded-2xl
        prose-pre:bg-slate-900
        prose-pre:p-3 sm:prose-pre:p-5
        prose-pre:shadow-lg
        prose-pre:text-xs sm:prose-pre:text-sm
        prose-pre:before:hidden
        prose-pre:after:hidden

        /* Blockquotes */
        prose-blockquote:my-2.5 sm:prose-blockquote:my-4
        prose-blockquote:rounded-r-xl sm:prose-blockquote:rounded-2xl
        prose-blockquote:border-l-4
        prose-blockquote:border-[#3559D4]
        dark:prose-blockquote:border-indigo-500
        prose-blockquote:bg-blue-50/60
        dark:prose-blockquote:bg-indigo-950/40
        prose-blockquote:py-2 sm:prose-blockquote:py-3
        prose-blockquote:pr-3 sm:prose-blockquote:pr-4
        prose-blockquote:pl-3 sm:prose-blockquote:pl-4
        prose-blockquote:italic
        prose-blockquote:text-slate-700
        dark:prose-blockquote:text-slate-200
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="my-3 sm:my-4 w-full overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <table className="w-full border-collapse text-xs sm:text-sm text-left" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800/90 px-3 sm:px-4 py-2 sm:py-2.5 font-bold text-slate-900 dark:text-white" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-slate-100 dark:border-slate-800/60 px-3 sm:px-4 py-2 sm:py-2.5 text-slate-700 dark:text-slate-200" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" className="font-semibold text-[#3559D4] dark:text-indigo-400 hover:underline" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;