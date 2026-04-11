export function parseFrontmatter(rawContent) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: rawContent };

  const frontmatterStr = match[1];
  const content = match[2];
  const data = {};

  frontmatterStr.split(/\r?\n/).forEach(line => {
    const divider = line.indexOf(':');
    if (divider === -1) return;
    const key = line.slice(0, divider).trim();
    let val = line.slice(divider + 1).trim();

    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    } else if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => {
        let clean = s.trim();
        if (clean.startsWith('"') && clean.endsWith('"')) clean = clean.slice(1, -1);
        return clean;
      }).filter(Boolean);
    } else if (!isNaN(Number(val)) && val !== '') {
      val = Number(val);
    }
    data[key] = val;
  });

  return { data, content };
}

function extractExcerpt(content) {
  // Remove markdown headers
  let text = content.replace(/^#+.*$/gm, '');
  // Remove markdown list markers
  text = text.replace(/^-\s+/gm, '');
  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  // Remove bold/italic markers
  text = text.replace(/[*_~`]/g, '');
  // Clean up excessive whitespace
  text = text.replace(/\n\s*\n/g, '\n').trim();
  
  // Take first 120 characters from first valid line
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return '';
  
  const snippet = lines[0];
  return snippet.length > 120 ? snippet.slice(0, 117) + '...' : snippet;
}

export function loadGraphData() {
  const mdFiles = import.meta.glob('../../content/**/*.md', { eager: true, query: '?raw', import: 'default' });

  const nodes = [];
  const links = [];

  for (const path in mdFiles) {
    const rawContent = String(mdFiles[path]);
    const { data: frontmatter, content } = parseFrontmatter(rawContent);

    const id = frontmatter.id || path.split('/').pop().replace('.md', '');
    nodes.push({
      id,
      label: frontmatter.label || id,
      subtitle: frontmatter.subtitle || '',
      category: frontmatter.category || 'unknown',
      size: frontmatter.size || 20,
      color: frontmatter.color || '#333333',
      icon: frontmatter.icon || 'Circle',
      connections: frontmatter.connections || [],
      content: content,
      excerpt: frontmatter.description || extractExcerpt(content)
    });
  }

  // Build links mapping
  for (const node of nodes) {
    if (node.connections && Array.isArray(node.connections)) {
      for (const target of node.connections) {
        links.push({
          source: node.id,
          target: target
        });
      }
    }
  }

  const categories = [...new Set(nodes.map(n => n.category))];

  return { nodes, links, categories };
}
