import React, { useMemo, useCallback } from 'react';

export default function MiniMap({
  nodes = [],
  links = [],
  transform = null,
  visible = false,
  onViewportClick = null,
}) {
  const MINIMAP_WIDTH = 180;
  const MINIMAP_HEIGHT = 140;
  const PADDING = 8;

  // Calculate bounds of all nodes
  const bounds = useMemo(() => {
    if (!nodes || nodes.length === 0) {
      return { minX: 0, maxX: 1000, minY: 0, maxY: 800, width: 1000, height: 800 };
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      if (n.x !== undefined && n.y !== undefined) {
        minX = Math.min(minX, n.x);
        maxX = Math.max(maxX, n.x);
        minY = Math.min(minY, n.y);
        maxY = Math.max(maxY, n.y);
      }
    });

    // If no valid nodes, return default
    if (minX === Infinity) {
      return { minX: 0, maxX: 1000, minY: 0, maxY: 800, width: 1000, height: 800 };
    }

    // Add proportional padding based on the graph size
    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const paddingX = graphWidth * 0.15; // 15% padding
    const paddingY = graphHeight * 0.15;

    minX -= paddingX;
    maxX += paddingX;
    minY -= paddingY;
    maxY += paddingY;

    return {
      minX,
      maxX,
      minY,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [nodes]);

  // Calculate scale to fit the minimap
  const scale = useMemo(() => {
    const scaleX = (MINIMAP_WIDTH - PADDING * 2) / bounds.width;
    const scaleY = (MINIMAP_HEIGHT - PADDING * 2) / bounds.height;
    return Math.min(scaleX, scaleY);
  }, [bounds]);

  // Transform world coordinates to minimap coordinates
  const worldToMinimap = useCallback((x, y) => {
    const mmX = ((x - bounds.minX) * scale) + PADDING;
    const mmY = ((y - bounds.minY) * scale) + PADDING;
    return { mmX, mmY };
  }, [bounds, scale]);

  // Calculate viewport rectangle
  const viewport = useMemo(() => {
    if (!transform) return null;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // The viewport in world coordinates needs to be calculated from the inverse transform
    // Current screen (0,0) to (width,height) maps to world coordinates through inverse transform
    const invScale = 1 / transform.k;
    const worldX = -transform.x * invScale;
    const worldY = -transform.y * invScale;
    const worldW = width * invScale;
    const worldH = height * invScale;

    // Convert to minimap coordinates
    const p1 = worldToMinimap(worldX, worldY);
    const p2 = worldToMinimap(worldX + worldW, worldY + worldH);

    return {
      x: Math.min(p1.mmX, p2.mmX),
      y: Math.min(p1.mmY, p2.mmY),
      width: Math.abs(p2.mmX - p1.mmX),
      height: Math.abs(p2.mmY - p1.mmY),
    };
  }, [transform, worldToMinimap]);

  // Check if viewport covers most of the minimap (to determine visibility)
  const shouldShow = useMemo(() => {
    // Always show for testing
    return true;
  }, []);

  const handleMiniMapClick = useCallback((e) => {
    if (!onViewportClick || !viewport || !transform) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert click position to world coordinates
    const worldX = bounds.minX + (clickX - PADDING) / scale;
    const worldY = bounds.minY + (clickY - PADDING) / scale;

    // Center the viewport on this point
    const width = window.innerWidth;
    const height = window.innerHeight;

    const invScale = 1 / transform.k;
    const viewportHalfW = (width * invScale) / 2;
    const viewportHalfH = (height * invScale) / 2;

    const targetX = width / 2 - worldX * transform.k;
    const targetY = height / 2 - worldY * transform.k;

    onViewportClick({ x: targetX, y: targetY, k: transform.k });
  }, [viewport, transform, bounds, scale, onViewportClick]);

  return (
    <div
      className="absolute bottom-6 right-6 z-50 transition-all duration-300"
      style={{
        opacity: visible && shouldShow ? 1 : 0,
        pointerEvents: visible && shouldShow ? 'auto' : 'none',
        transform: visible && shouldShow ? 'scale(1)' : 'scale(0.95)',
      }}
    >
      <div
        className="rounded-lg border border-white/[0.08] p-2 cursor-pointer hover:border-white/[0.16] transition-colors"
        style={{
          backgroundColor: 'rgba(12, 12, 16, 0.6)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 0.5px rgba(255,255,255,0.04)',
          width: MINIMAP_WIDTH,
          height: MINIMAP_HEIGHT,
        }}
        onClick={handleMiniMapClick}
      >
        {/* Minimap SVG */}
        <svg
          className="w-full h-full"
          style={{ display: 'block' }}
          viewBox={`0 0 ${MINIMAP_WIDTH} ${MINIMAP_HEIGHT}`}
          shapeRendering="crispEdges"
        >
          {/* Links */}
          {links.map((link, i) => {
            const source = link.source.id ? link.source : nodes.find(n => n.id === link.source);
            const target = link.target.id ? link.target : nodes.find(n => n.id === link.target);

            if (!source || !target) return null;

            const p1 = worldToMinimap(source.x, source.y);
            const p2 = worldToMinimap(target.x, target.y);

            return (
              <line
                key={`link-${i}`}
                x1={p1.mmX}
                y1={p1.mmY}
                x2={p2.mmX}
                y2={p2.mmY}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.4"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = worldToMinimap(node.x, node.y);
            const nodeSize = Math.max(1, (node.size || 14) * scale * 0.5);

            return (
              <circle
                key={`node-${node.id}`}
                cx={pos.mmX}
                cy={pos.mmY}
                r={nodeSize}
                fill={node.color || '#ffffff'}
                opacity="0.8"
              />
            );
          })}

          {/* Viewport Rectangle */}
          {viewport && (
            <rect
              x={viewport.x}
              y={viewport.y}
              width={viewport.width}
              height={viewport.height}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              pointerEvents="none"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
