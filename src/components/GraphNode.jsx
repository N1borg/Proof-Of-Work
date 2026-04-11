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
          className="absolute pointer-events-none transition-all duration-400 ease-out"
          style={{
            left: 'calc(100% + 16px)',
            top: '50%',
            transform: `translateY(-50%) ${isHovered && node.excerpt ? 'scale(1)' : 'scale(0.95)'}`,
            opacity: isHovered && node.excerpt ? 1 : 0,
            filter: isHovered && node.excerpt ? 'blur(0px)' : 'blur(8px)',
            visibility: isHovered && node.excerpt ? 'visible' : 'hidden',
          }}
        >
          {node.excerpt && (
            <div 
              className="w-48 p-3 rounded-lg text-left"
              style={{
                backgroundColor: 'rgba(30, 30, 35, 0.45)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[8px] uppercase tracking-widest text-white/40">{node.category}</span>
              </div>
              <p className="text-[10px] leading-relaxed text-white/70 line-clamp-3 overflow-hidden text-ellipsis m-0">
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
