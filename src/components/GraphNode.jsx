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
  const size = node.size || 14;
  const diameter = size * 2.2;
  const highlighted = isActive || isHovered;
  const scale = highlighted ? 1.2 : isDimmed ? 0.9 : 1;

  return (
    <>
      {/* Label and Preview Card */}
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

        {/* Hover Preview Card */}
        <div 
          className="mt-3 overflow-hidden transition-all duration-300 ease-out"
          style={{
            opacity: isHovered && node.excerpt ? 1 : 0,
            maxHeight: isHovered && node.excerpt ? '100px' : '0px',
            transform: isHovered && node.excerpt ? 'translateY(0)' : 'translateY(-10px)',
          }}
        >
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
            <p className="text-[10px] leading-relaxed text-white/60 line-clamp-3">
              {node.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Circle */}
      <div
        ref={nodeRef}
        className="absolute rounded-full flex items-center justify-center cursor-pointer border"
        style={{
          width: diameter,
          height: diameter,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transition: 'transform 0.25s ease-out, opacity 0.35s ease, box-shadow 0.3s, border-color 0.3s',
          opacity: isDimmed ? 0.22 : 1,
          backgroundColor: 'rgba(8, 8, 8, 0.85)',
          borderColor: isDimmed ? 'rgba(255,255,255,0.06)' : `${node.color}50`,
          boxShadow: highlighted
            ? `0 0 24px 4px ${node.color}30, 0 0 60px 8px ${node.color}10, inset 0 0 12px ${node.color}15`
            : 'none',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Icon
          size={size}
          color={isDimmed ? 'rgba(255,255,255,0.2)' : node.color}
          strokeWidth={1.5}
        />
      </div>
    </>
  );
});

export default GraphNode;
