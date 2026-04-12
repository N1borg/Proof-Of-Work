import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Maximize2, Minimize2, Calendar } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ node, onClose, onExpandChange }) {
  const [expanded, setExpanded] = useState(false);

  // Reset expanded state when node changes
  const prevNodeRef = React.useRef(null);
  if (node?.id !== prevNodeRef.current) {
    prevNodeRef.current = node?.id;
    if (expanded) setExpanded(false);
  }

  const handleToggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    onExpandChange?.(next);
  };

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
          background: 'rgba(18, 18, 22, 0.55)',
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.05), -8px 0 40px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {node && (
          <>
            {/* Accent line at top */}
            <div
              className="h-[2px] w-full shrink-0"
              style={{ background: `linear-gradient(90deg, ${node.color}60, ${node.color}15, transparent)` }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-6 pb-5 border-b border-white/[0.06] shrink-0">
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
                  onClick={handleToggleExpand}
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

            {/* Date badge */}
            {node.date && (
              <div className="px-8 pt-4 pb-2 flex items-center gap-2 shrink-0">
                <Calendar size={12} style={{ color: node.color }} className="opacity-60" />
                <span className="text-[11px] tracking-wide text-white/40">{node.date}</span>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 sidebar-content cursor-text">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-[22px] font-normal tracking-tight text-white/90 border-b border-white/[0.06] pb-4 mb-6 mt-1 leading-snug">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] mt-9 mb-3"
                      style={{ color: `${node.color}90` }}
                    >{children}</h2>
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
                    <li className="leading-[1.7] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:w-1 before:h-1 before:rounded-full"
                      style={{ '--tw-before-bg': node.color }}
                    >
                      <span className="before:absolute before:left-0 before:top-[10px] before:w-1 before:h-1 before:rounded-full" style={{}}></span>
                      {children}
                    </li>
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
                        <code className="text-[12px] font-mono leading-relaxed" style={{ color: `${node.color}99` }}>{children}</code>
                      );
                    }
                    return (
                      <code className="text-[12px] font-mono px-1.5 py-0.5 rounded border border-white/[0.04]"
                        style={{ backgroundColor: `${node.color}10`, color: `${node.color}cc` }}
                      >{children}</code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-[#07080a] border border-white/[0.05] rounded-lg p-5 my-6 overflow-x-auto">{children}</pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="pl-5 my-6 text-[13px] italic text-white/35"
                      style={{ borderLeft: `2px solid ${node.color}30` }}
                    >{children}</blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="underline underline-offset-2 transition-colors" style={{ color: `${node.color}bb`, textDecorationColor: `${node.color}30` }} target="_blank" rel="noopener noreferrer">{children}</a>
                  ),
                  hr: () => (
                    <hr className="my-8" style={{ borderColor: `${node.color}15` }} />
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
