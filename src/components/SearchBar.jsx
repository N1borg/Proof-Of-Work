import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { searchNodes } from '../utils/searchEngine';
import clsx from 'clsx';

export default function SearchBar({ graphData, onSearchResults, onNodeSelect, onHoverNode }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle search result selection
  const handleSelectResult = useCallback((result) => {
    onNodeSelect(result.node);
    closeSearch();
  }, [onNodeSelect]);

  // Close search modal
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setHighlightedIndex(-1);
    onSearchResults({ results: [], query: '' });
    onHoverNode(null);
  }, [onSearchResults, onHoverNode]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeSearch();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeSearch]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        if (results[highlightedIndex]) {
          handleSelectResult(results[highlightedIndex]);
        }
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, highlightedIndex, handleSelectResult, closeSearch]);

  // Handle search input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setHighlightedIndex(-1);

    if (value.trim().length > 0 && graphData) {
      const searchResults = searchNodes(value, graphData.nodes);
      setResults(searchResults);
      onSearchResults({ results: searchResults, query: value });
    } else {
      setResults([]);
      onSearchResults({ results: [], query: '' });
    }
  };

  // Handle result hover
  const handleResultHover = (result) => {
    onHoverNode(result.node);
  };

  const handleResultLeave = () => {
    onHoverNode(null);
  };

  // Highlight matched text in snippet
  const highlightSnippet = (snippet, query) => {
    if (!snippet || !query) return snippet;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = snippet.split(regex);
    
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      {/* Search Icon Button - Top Left under Topbar */}
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 50);
        }}
        className={clsx(
          'absolute top-24 left-8 z-40 p-2.5 rounded-full transition-all duration-300 group',
          isOpen && 'pointer-events-none'
        )}
        style={{
          background: 'rgba(120, 113, 108, 0.12)',
          backdropFilter: 'blur(20px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
          border: '1px solid rgba(120, 113, 108, 0.2)',
          boxShadow: 'inset 0 0 0 0.5px rgba(120, 113, 108, 0.1)',
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scale(0.8)' : 'scale(1)',
          transition: 'opacity 0.3s ease, transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
        }}
        title="Search"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(120, 113, 108, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(120, 113, 108, 0.35)';
          e.currentTarget.style.boxShadow = 'inset 0 0 0 0.5px rgba(120, 113, 108, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(120, 113, 108, 0.12)';
          e.currentTarget.style.borderColor = 'rgba(120, 113, 108, 0.2)';
          e.currentTarget.style.boxShadow = 'inset 0 0 0 0.5px rgba(120, 113, 108, 0.1)';
        }}
      >
        <Search size={18} className="text-gray-400 group-hover:text-gray-300 transition-colors" />
      </button>

      {/* Search Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            animation: 'fadeIn 0.4s ease-out'
          }}
          onClick={closeSearch}
        />
      )}

      {/* Search Modal */}
      {isOpen && (
        <div
          ref={modalRef}
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl transition-all duration-300"
          style={{
            transform: 'translate(-50%, -50%)',
            animation: 'expandModal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Content */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(18, 18, 22, 0.75)',
              backdropFilter: 'blur(40px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.05), 0 25px 50px rgba(0,0,0,0.4)'
            }}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
              <Search size={18} className="text-white/40 flex-shrink-0" />
              <input
                ref={inputRef}
                autoFocus
                type="text"
                placeholder="Search projects, skills, experience..."
                value={query}
                onChange={handleInputChange}
                className={clsx(
                  'flex-1 bg-transparent outline-none text-base text-white/90',
                  'placeholder-white/30'
                )}
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    onSearchResults({ results: [], query: '' });
                  }}
                  className="text-white/40 hover:text-white/60 transition-colors flex-shrink-0 p-1"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Results List */}
            {results.length > 0 && (
              <div className="max-h-96 overflow-y-auto search-results">
                {results.map((result, index) => (
                  <div
                    key={result.node.id}
                    onClick={() => handleSelectResult(result)}
                    onMouseEnter={() => handleResultHover(result)}
                    onMouseLeave={handleResultLeave}
                    className={clsx(
                      'px-6 py-4 cursor-pointer transition-all duration-200 border-b border-white/[0.04] last:border-b-0',
                      'hover:bg-white/[0.06]'
                    )}
                  >
                    {/* Node Header */}
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 transition-all duration-200"
                        style={{
                          backgroundColor: result.node.color,
                          boxShadow: `0 0 8px ${result.node.color}40`
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        {/* Title with highlight */}
                        <div className="flex items-baseline gap-2 mb-1">
                          <p className="text-sm font-medium text-white/90">
                            {result.matches.titleMatch ? (
                              <>
                                {result.node.label.split(new RegExp(`(${query})`, 'i')).map((part, i) =>
                                  part.toLowerCase() === query.toLowerCase() ? (
                                    <mark key={i} className="bg-yellow-500/30 font-semibold">
                                      {part}
                                    </mark>
                                  ) : (
                                    part
                                  )
                                )}
                              </>
                            ) : (
                              result.node.label
                            )}
                          </p>
                          <span className="text-[10px] uppercase tracking-wider text-white/30 flex-shrink-0">
                            {result.node.category}
                          </span>
                        </div>

                        {/* Subtitle */}
                        {result.node.subtitle && (
                          <p className={clsx(
                            'text-xs truncate',
                            result.matches.subtitleMatch ? 'text-white/70' : 'text-white/50'
                          )}>
                            {result.node.subtitle}
                          </p>
                        )}

                        {/* Content snippet */}
                        {result.matches.contentMatches.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {result.matches.contentMatches.slice(0, 2).map((match, i) => (
                              <p key={i} className="text-xs text-white/40 line-clamp-1">
                                ...{highlightSnippet(match.snippet, query)}...
                              </p>
                            ))}
                            {result.matches.contentMatches.length > 2 && (
                              <p className="text-xs text-white/30">
                                +{result.matches.contentMatches.length - 2} more matches
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results message */}
            {query.trim().length > 0 && results.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-white/40">No results found for "{query}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes expandModal {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
