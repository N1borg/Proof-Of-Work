import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { loadGraphData } from '../utils/markdownParser';
import Sidebar from './Sidebar';
import GraphNode from './GraphNode';
import Topbar from './Topbar';
import MiniMap from './MiniMap';
import SearchBar from './SearchBar';

export default function GraphEngine() {
  const containerRef = useRef(null);
  const transformLayerRef = useRef(null);
  const simRef = useRef(null);
  const zoomRef = useRef(null);
  const nodeRefsMap = useRef({});
  const labelRefsMap = useRef({});
  const linkRefsArray = useRef([]);
  const savedTransformRef = useRef(null);

  const [graphData, setGraphData] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [zoomTransform, setZoomTransform] = useState(null);
  const [minimapVisible, setMinimapVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHoveredNode, setSearchHoveredNode] = useState(null);
  const minimapTimeoutRef = useRef(null);

  // ── Load data once ──
  useEffect(() => {
    const data = loadGraphData();
    setGraphData(data);
  }, []);

  // ── Force simulation ──
  useEffect(() => {
    if (!graphData) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const cats = [...new Set(graphData.nodes.map(n => n.category))];
    const clusterTargets = {};
    cats.forEach((cat, i) => {
      if (cat === 'center') {
        clusterTargets[cat] = { x: width / 2, y: height / 2 };
      } else {
        const angle = (i / cats.length) * Math.PI * 2 - Math.PI / 2;
        const spread = Math.min(width, height) * 0.28;
        clusterTargets[cat] = {
          x: width / 2 + Math.cos(angle) * spread,
          y: height / 2 + Math.sin(angle) * spread,
        };
      }
    });

    graphData.nodes.forEach(n => {
      const c = clusterTargets[n.category] || { x: width / 2, y: height / 2 };
      n.x = c.x + (Math.random() - 0.5) * 200;
      n.y = c.y + (Math.random() - 0.5) * 200;
    });

    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(140).strength(0.35))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('collide', d3.forceCollide().radius(d => (d.size || 14) + 22).iterations(2))
      .force('x', d3.forceX().x(d => clusterTargets[d.category]?.x || width / 2).strength(0.04))
      .force('y', d3.forceY().y(d => clusterTargets[d.category]?.y || height / 2).strength(0.04))
      .alphaDecay(0.02)
      .velocityDecay(0.35);

    simulation.on('tick', () => {
      graphData.links.forEach((link, i) => {
        const el = linkRefsArray.current[i];
        if (!el) return;
        el.setAttribute('x1', link.source.x);
        el.setAttribute('y1', link.source.y);
        el.setAttribute('x2', link.target.x);
        el.setAttribute('y2', link.target.y);
      });

      graphData.nodes.forEach(n => {
        const nodeEl = nodeRefsMap.current[n.id];
        const labelEl = labelRefsMap.current[n.id];
        if (nodeEl) {
          nodeEl.style.left = `${n.x}px`;
          nodeEl.style.top = `${n.y}px`;
        }
        if (labelEl) {
          labelEl.style.left = `${n.x}px`;
          labelEl.style.top = `${n.y + (n.size || 14) * 1.1 + 10}px`;
        }
      });
    });

    simRef.current = simulation;
    return () => simulation.stop();
  }, [graphData]);

  // ── Zoom / Pan ──
  useEffect(() => {
    if (!containerRef.current || !transformLayerRef.current) return;

    const layer = transformLayerRef.current;
    const zoom = d3.zoom()
      .scaleExtent([0.15, 4])
      // 3x faster scroll-to-zoom
      .wheelDelta((event) => -event.deltaY * (event.deltaMode === 1 ? 0.15 : event.deltaMode ? 1 : 0.006))
      .on('zoom', (e) => {
        const { x, y, k } = e.transform;
        layer.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
        
        // Update zoom transform and show minimap
        setZoomTransform(e.transform);
        setMinimapVisible(true);
        
        // Auto-hide minimap after 2 seconds
        if (minimapTimeoutRef.current) {
          clearTimeout(minimapTimeoutRef.current);
        }
        minimapTimeoutRef.current = setTimeout(() => {
          setMinimapVisible(false);
        }, 2000);
      });

    const sel = d3.select(containerRef.current);
    sel.call(zoom).on('dblclick.zoom', null);
    zoomRef.current = { zoom, selection: sel };

    return () => {
      if (minimapTimeoutRef.current) clearTimeout(minimapTimeoutRef.current);
    };
  }, [graphData]);

  // ── Camera focus when a node is selected ──
  const focusOnGroup = useCallback((node, isExpanded = false) => {
    if (!graphData || !zoomRef.current) return;

    const { zoom, selection } = zoomRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const connIds = new Set([node.id]);
    graphData.links.forEach(l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      if (sid === node.id) connIds.add(tid);
      if (tid === node.id) connIds.add(sid);
    });

    const connNodes = graphData.nodes.filter(n => connIds.has(n.id));
    if (!connNodes.length) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    connNodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });

    const padding = 120;
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;

    const bboxW = maxX - minX;
    const bboxH = maxY - minY;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    if (!activeNode) {
      savedTransformRef.current = d3.zoomTransform(selection.node());
    }

    const sidebarWidth = isExpanded ? Math.min(900, width * 0.95) : Math.min(480, width * 0.38);
    const viewW = width - sidebarWidth;
    const viewH = height;

    const scale = Math.min(2, Math.max(0.5, Math.min(viewW / bboxW, viewH / bboxH) * 0.85));
    const targetX = viewW / 2 - cx * scale;
    const targetY = viewH / 2 - cy * scale;

    const transform = d3.zoomIdentity.translate(targetX, targetY).scale(scale);

    selection.transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .call(zoom.transform, transform);
  }, [graphData]);

  // ── Reset camera when sidebar closes ──
  const resetCamera = useCallback(() => {
    if (!graphData || !zoomRef.current) return;

    const { zoom, selection } = zoomRef.current;
    
    if (savedTransformRef.current) {
      selection.transition()
        .duration(500)
        .ease(d3.easeCubicOut)
        .call(zoom.transform, savedTransformRef.current);
      savedTransformRef.current = null;
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    graphData.nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });

    const padding = 100;
    const bboxW = (maxX - minX) + padding * 2;
    const bboxH = (maxY - minY) + padding * 2;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const scale = Math.min(1.5, Math.min(width / bboxW, height / bboxH) * 0.9);
    const targetX = width / 2 - cx * scale;
    const targetY = height / 2 - cy * scale;

    const transform = d3.zoomIdentity.translate(targetX, targetY).scale(scale);

    selection.transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .call(zoom.transform, transform);
  }, [graphData]);

  // ── Interaction helpers ──
  const connectedIds = useMemo(() => {
    if (!graphData) return null;
    
    const ids = new Set();
    
    // Only add search hovered node (temporary hover from search results)
    if (searchHoveredNode) {
      ids.add(searchHoveredNode.id);
    }
    
    // Add selected category nodes
    if (selectedCategory) {
      graphData.nodes.forEach(n => {
        if (n.category === selectedCategory) {
          ids.add(n.id);
        }
      });
    }
    
    // Add active node and its connections
    const target = activeNode || hoveredNode;
    if (target) {
      ids.add(target.id);
      graphData.links.forEach(l => {
        const sid = typeof l.source === 'object' ? l.source.id : l.source;
        const tid = typeof l.target === 'object' ? l.target.id : l.target;
        if (sid === target.id) ids.add(tid);
        if (tid === target.id) ids.add(sid);
      });
    }
    
    return ids.size > 0 ? ids : null;
  }, [graphData, activeNode, hoveredNode, selectedCategory, searchHoveredNode]);

  const handleNodeClick = useCallback((node) => {
    setActiveNode(prev => {
      if (prev?.id === node.id) {
        resetCamera();
        return null;
      }
      focusOnGroup(node);
      return node;
    });
  }, [focusOnGroup, resetCamera]);

  const handleSearchResults = useCallback((searchData) => {
    if (typeof searchData === 'object' && searchData.results !== undefined) {
      setSearchResults(searchData.results);
      setSearchQuery(searchData.query);
    } else {
      // Fallback for array format
      setSearchResults(searchData || []);
      setSearchQuery('');
    }
  }, []);

  const handleSearchNodeSelect = useCallback((node) => {
    handleNodeClick(node);
  }, [handleNodeClick]);

  const handleCloseSidebar = useCallback(() => {
    setActiveNode(null);
    resetCamera();
  }, [resetCamera]);

  const handleSidebarExpand = useCallback((isExpanded) => {
    if (activeNode) {
      focusOnGroup(activeNode, isExpanded);
    }
  }, [activeNode, focusOnGroup]);

  // Handle minimap viewport navigation
  const handleMinimapClick = useCallback((newTransform) => {
    if (!zoomRef.current) return;
    
    const { zoom, selection } = zoomRef.current;
    const transform = d3.zoomIdentity.translate(newTransform.x, newTransform.y).scale(newTransform.k);
    
    selection.transition()
      .duration(300)
      .ease(d3.easeCubicOut)
      .call(zoom.transform, transform);
  }, []);

  // Build category list for toplbar legend
  const categoryList = useMemo(() => {
    if (!graphData) return [];
    const seen = new Map();
    graphData.nodes.forEach(n => {
      if (!seen.has(n.category)) {
        seen.set(n.category, { name: n.category, color: n.color });
      }
    });
    return Array.from(seen.values());
  }, [graphData]);

  if (!graphData) return null;

  return (
    <>
      <div className="noise-bg absolute inset-0 pointer-events-none z-[60]" />

      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing">
        {/* No will-change here — lets the browser re-rasterize at each zoom level for crisp rendering */}
        <div ref={transformLayerRef} style={{ transformOrigin: '0 0' }}>
          {/* SVG Links — vector-effect keeps strokes crisp at any zoom */}
          <svg
            className="absolute overflow-visible"
            style={{ width: 1, height: 1 }}
            shapeRendering="geometricPrecision"
          >
            {graphData.links.map((link, i) => {
              const sid = typeof link.source === 'object' ? link.source.id : link.source;
              const tid = typeof link.target === 'object' ? link.target.id : link.target;
              const isHighlighted = connectedIds && connectedIds.has(sid) && connectedIds.has(tid);
              const isDimmed = connectedIds && !isHighlighted;

              return (
                <line
                  key={`${sid}-${tid}-${i}`}
                  ref={el => linkRefsArray.current[i] = el}
                  stroke={isDimmed ? 'rgba(255,255,255,0.05)' : isHighlighted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={isDimmed ? 0.6 : isHighlighted ? 2.0 : 1.0}
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: 'stroke 0.4s, stroke-width 0.4s' }}
                />
              );
            })}
          </svg>

          {/* HTML Nodes */}
          {graphData.nodes.map((node) => {
            const isDimmed = connectedIds && !connectedIds.has(node.id);
            const isActive = activeNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;

            return (
              <GraphNode
                key={node.id}
                node={node}
                nodeRef={el => nodeRefsMap.current[node.id] = el}
                labelRef={el => labelRefsMap.current[node.id] = el}
                isDimmed={isDimmed}
                isActive={isActive}
                isHovered={isHovered}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              />
            );
          })}
        </div>
      </div>

      <Topbar categories={categoryList} selectedCategory={selectedCategory} onCategoryClick={setSelectedCategory} />
      <SearchBar
        graphData={graphData}
        onSearchResults={handleSearchResults}
        onNodeSelect={handleSearchNodeSelect}
        onHoverNode={setSearchHoveredNode}
      />
      <Sidebar node={activeNode} onClose={handleCloseSidebar} onExpandChange={handleSidebarExpand} searchResults={searchResults} />
      <MiniMap
        nodes={graphData.nodes}
        links={graphData.links}
        transform={zoomTransform}
        visible={minimapVisible && !activeNode}
        onViewportClick={handleMinimapClick}
      />
    </>
  );
}
