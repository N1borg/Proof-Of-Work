/**
 * Search engine to find text across all node data
 * Returns matching nodes with highlighted snippets
 */

export function searchNodes(query, nodes) {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results = [];

  nodes.forEach(node => {
    const matches = {
      titleMatch: false,
      subtitleMatch: false,
      contentMatches: [],
    };

    // Search in title
    if (node.label.toLowerCase().includes(lowerQuery)) {
      matches.titleMatch = true;
    }

    // Search in subtitle
    if (node.subtitle && node.subtitle.toLowerCase().includes(lowerQuery)) {
      matches.subtitleMatch = true;
    }

    // Search in content
    if (node.content) {
      const lines = node.content.split('\n');

      lines.forEach((line, lineIndex) => {
        if (line.toLowerCase().includes(lowerQuery)) {
          // Extract context around match (30 chars before and after)
          const matchIndex = line.toLowerCase().indexOf(lowerQuery);
          const start = Math.max(0, matchIndex - 30);
          const end = Math.min(line.length, matchIndex + lowerQuery.length + 30);
          
          const snippet = line.substring(start, end).trim();

          matches.contentMatches.push({
            line: lineIndex + 1,
            snippet: snippet,
            matchIndex: matchIndex,
            queryLength: lowerQuery.length
          });
        }
      });
    }

    // Determine if this node matches
    if (matches.titleMatch || matches.subtitleMatch || matches.contentMatches.length > 0) {
      results.push({
        node,
        matches,
        score: calculateScore(matches)
      });
    }
  });

  // Sort by relevance score
  return results.sort((a, b) => b.score - a.score);
}

function calculateScore(matches) {
  let score = 0;

  if (matches.titleMatch) score += 100;
  if (matches.subtitleMatch) score += 50;
  score += matches.contentMatches.length * 10;

  return score;
}

/**
 * Highlight matching text in content
 * @param {string} text - The text to highlight
 * @param {string} query - The search query
 * @returns {string} HTML with highlights
 */
export function highlightText(text, query) {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
