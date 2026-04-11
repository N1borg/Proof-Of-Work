import React, { memo } from 'react';
import * as Icons from 'lucide-react';

const GraphNode = memo(function GraphNode({
  node,
  nodeRef,
  labelRef,
  isDimmed,
  isActive,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const Icon = Icons[node.icon] || Icons.Circle;
  const size = Math.round(node.size || 14);
  let rawDiameter = Math.round(size * 2.2);
  const diameter = rawDiameter % 2 === 0 ? rawDiameter : rawDiameter + 1;
  
  const highlighted = isActive || isHovered;
  const scale = highlighted ? 1.2 : 1;

  const [previewPos, setPreviewPos] = React.useState('right');

  React.useEffect(() => {
    if (isHovered && node.excerpt && nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      const currentZoomScale = rect.width / diameter;
      
      const padding = 24; 
      const topBarHeight = 80; // Reserve space for the Topbar
      
      const actualCardWidth = 210 * currentZoomScale; 
      const actualCardHeight = 130 * currentZoomScale;
      
      const spaceRight = window.innerWidth - rect.right - padding;
      const spaceLeft = rect.left - padding;
      const spaceBottom = window.innerHeight - rect.bottom - padding;
      const spaceTop = rect.top - topBarHeight - padding;

      const rightOk = spaceRight >= actualCardWidth;
      const leftOk = spaceLeft >= actualCardWidth;
      const bottomOk = spaceBottom >= actualCardHeight;
      const topOk = spaceTop >= actualCardHeight;

      let pos = 'right'; // Our default ideal position

      // Simple waterfall for optimal placement tracking
      if (rightOk) pos = 'right';
      else if (leftOk) pos = 'left';
      else if (bottomOk) pos = 'bottom';
      else if (topOk) pos = 'top';
      else {
        // Completely cornered! Find the absolute maximum available coordinate space
        const maxSpace = Math.max(spaceRight, spaceLeft, spaceBottom, spaceTop);
        if (maxSpace === spaceRight) pos = 'right';
        else if (maxSpace === spaceLeft) pos = 'left';
        else if (maxSpace === spaceBottom) pos = 'bottom';
        else pos = 'top';
      }
      
      setPreviewPos(pos);
    }
  }, [isHovered, node.excerpt, diameter]);

  const getPreviewStyle = () => {
    // Explicitly unsetting opposite boundaries to break CSS transition sticky limits
    switch (previewPos) {
      case 'left': return { right: 'calc(100% + 16px)', left: 'auto', top: '50%', bottom: 'auto', transform: 'translateY(-50%)' };
      case 'bottom': return { top: 'calc(100% + 16px)', bottom: 'auto', left: '50%', right: 'auto', transform: 'translateX(-50%)' };
      case 'top': return { bottom: 'calc(100% + 16px)', top: 'auto', left: '50%', right: 'auto', transform: 'translateX(-50%)' };
      case 'right': 
      default: return { left: 'calc(100% + 16px)', right: 'auto', top: '50%', bottom: 'auto', transform: 'translateY(-50%)' };
    }
  };

  return (
    <>
      {/* Label entirely separate from the circle wrapper */}
      <div
        ref={labelRef}
        className="absolute pointer-events-none select-none text-center flex flex-col items-center"
        style={{
          transform: 'translate(-50%, 0)',
          transition: 'opacity 0.35s ease',
          opacity: isDimmed ? 0.2 : 1,
          zIndex: highlighted ? 10 : 1,
        }}
      >
        <div className="whitespace-nowrap">
          <span className="text-[11px] font-medium tracking-wider text-white/70 uppercase">
            {node.label}
          </span>
          {highlighted && node.subtitle && (
            <div className="text-[9px] text-white/40 tracking-wide mt-0.5">
              {node.subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Node Logic Wrapper */}
      <div
        ref={nodeRef}
        className="absolute flex items-center justify-center cursor-pointer"
        style={{
          width: diameter,
          height: diameter,
          transform: 'translate(-50%, -50%)',
          zIndex: highlighted ? 20 : 1,
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Actual Circular Node (animated scaling) */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center border"
          style={{
            transform: `scale(${scale})`,
            transition: 'transform 0.25s ease-out, box-shadow 0.3s, border-color 0.3s',
            backgroundColor: 'rgba(8, 8, 8, 1)',
            borderColor: isDimmed ? 'rgba(255,255,255,0.06)' : `${node.color}50`,
            boxShadow: highlighted
              ? `0 0 24px 4px ${node.color}30, 0 0 60px 8px ${node.color}10, inset 0 0 12px ${node.color}15`
              : 'none',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <Icon
            size={size}
            color={isDimmed ? '#555555' : node.color}
            strokeWidth={1.5}
            style={{ transition: 'stroke 0.3s ease, color 0.3s ease' }}
          />
        </div>

        {/* Hover Preview Card attached to node wrapper */}
        <div 
          className="absolute pointer-events-none transition-all duration-300 ease-out"
          style={{
            opacity: isHovered && node.excerpt ? 1 : 0,
            visibility: isHovered && node.excerpt ? 'visible' : 'hidden',
            ...getPreviewStyle()
          }}
        >
          {node.excerpt && (
            <div 
              className="w-48 p-3 rounded-lg border border-white/[0.08] text-left"
              style={{
                backgroundColor: 'rgba(10, 10, 12, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[8px] uppercase tracking-widest text-white/40">{node.category}</span>
              </div>
              <p className="text-[10px] leading-relaxed text-white/60 line-clamp-3 overflow-hidden text-ellipsis m-0">
                {node.excerpt}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default GraphNode;
