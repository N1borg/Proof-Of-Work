import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ node, onClose }) {
  const [expanded, setExpanded] = useState(false);

  // Reset expanded state when node changes
  const prevNodeRef = React.useRef(null);
  if (node?.id !== prevNodeRef.current) {
    prevNodeRef.current = node?.id;
    if (expanded) setExpanded(false);
  }

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && node) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [node, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-40 transition-opacity duration-500',
          node ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={clsx(
          'fixed top-0 right-0 h-full z-50 flex flex-col',
          'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          node ? 'translate-x-0' : 'translate-x-full',
          'select-text cursor-auto'
        )}
        style={{
          width: expanded ? 'min(900px, 95vw)' : 'min(480px, 90vw)',
          background: 'rgba(10, 10, 12, 0.88)',
          backdropFilter: 'blur(32px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.3)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {node && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: node.color, boxShadow: `0 0 10px ${node.color}50` }}
                />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-0.5">{node.category}</p>
                  <h2 className="text-lg font-normal tracking-tight text-white/90 truncate">{node.label}</h2>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="p-2 rounded-full hover:bg-white/[0.06] transition-colors text-white/30 hover:text-white/70"
                  title={expanded ? 'Collapse' : 'Expand'}
                >
                  {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/[0.06] transition-colors text-white/30 hover:text-white/70"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 sidebar-content cursor-text">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-[22px] font-normal tracking-tight text-white/90 border-b border-white/[0.06] pb-4 mb-6 mt-1 leading-snug">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/50 mt-9 mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-medium text-white/65 mt-6 mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-[13.5px] leading-[1.75] text-white/55 mb-4">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2.5 mb-6 text-[13.5px] text-white/55">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="leading-[1.7] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:w-1 before:h-1 before:rounded-full before:bg-white/25">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white/75">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-white/45">{children}</em>
                  ),
                  code: ({ className, children }) => {
                    const isBlock = className?.includes('language-');
                    if (isBlock) {
                      return (
                        <code className="text-[12px] font-mono text-emerald-300/60 leading-relaxed">{children}</code>
                      );
                    }
                    return (
                      <code className="bg-white/[0.05] text-sky-300/70 text-[12px] font-mono px-1.5 py-0.5 rounded border border-white/[0.04]">{children}</code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-[#07080a] border border-white/[0.05] rounded-lg p-5 my-6 overflow-x-auto">{children}</pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-white/[0.08] pl-5 my-6 text-[13px] italic text-white/35">{children}</blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-sky-400/70 underline decoration-sky-400/20 hover:decoration-sky-400/50 underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>
                  ),
                  hr: () => (
                    <hr className="border-t border-white/[0.06] my-8" />
                  ),
                }}
              >
                {node.content}
              </ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </>
  );
}
