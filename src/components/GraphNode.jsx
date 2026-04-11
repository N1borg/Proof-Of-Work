import React, { memo, useState, useEffect, useCallback } from 'react';
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

  // ── Smart preview positioning ──
  const [previewSide, setPreviewSide] = useState('right');

  useEffect(() => {
    if (!isHovered || !node.excerpt || !nodeRef?.current) return;

    const rect = nodeRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const topBarH = 72;
    const cardW = 210;
    const cardH = 130;
    const gap = 18;

    const spaceR = vw - rect.right - gap;
    const spaceL = rect.left - gap;
    const spaceB = vh - rect.bottom - gap;
    const spaceT = rect.top - topBarH - gap;

    if (spaceR >= cardW) { setPreviewSide('right'); return; }
    if (spaceL >= cardW) { setPreviewSide('left'); return; }
    if (spaceB >= cardH) { setPreviewSide('bottom'); return; }
    if (spaceT >= cardH) { setPreviewSide('top'); return; }

    // Fallback: pick the side with the most room
    const max = Math.max(spaceR, spaceL, spaceB, spaceT);
    if (max === spaceL) setPreviewSide('left');
    else if (max === spaceB) setPreviewSide('bottom');
    else if (max === spaceT) setPreviewSide('top');
    else setPreviewSide('right');
  }, [isHovered, node.excerpt, nodeRef]);

  const previewPosition = (() => {
    const g = '16px';
    switch (previewSide) {
      case 'left':  return { right: `calc(100% + ${g})`, left: 'auto', top: '50%', bottom: 'auto', transform: 'translateY(-50%)' };
      case 'bottom': return { top: `calc(100% + ${g})`, bottom: 'auto', left: '50%', right: 'auto', transform: 'translateX(-50%)' };
      case 'top':    return { bottom: `calc(100% + ${g})`, top: 'auto', left: '50%', right: 'auto', transform: 'translateX(-50%)' };
      default:       return { left: `calc(100% + ${g})`, right: 'auto', top: '50%', bottom: 'auto', transform: 'translateY(-50%)' };
    }
  })();

  const showPreview = isHovered && node.excerpt;

  return (
    <>
      {/* Label */}
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

      {/* Node wrapper */}
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
        {/* Circle */}
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

        {/* Hover preview card */}
        {node.excerpt && (
          <div
            className="absolute pointer-events-none"
            style={{
              ...previewPosition,
              opacity: showPreview ? 1 : 0,
              filter: showPreview ? 'blur(0px)' : 'blur(6px)',
              visibility: showPreview ? 'visible' : 'hidden',
              transition: 'opacity 0.35s ease-out, filter 0.35s ease-out, transform 0.35s ease-out',
            }}
          >
            <div
              className="w-48 p-3 rounded-xl text-left overflow-hidden"
              style={{
                backgroundColor: 'rgba(22, 22, 28, 0.72)',
                backdropFilter: 'blur(40px) saturate(1.6)',
                WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
                border: `1px solid ${node.color}25`,
                boxShadow: `inset 0 0 0 0.5px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.35), 0 0 0 0.5px ${node.color}15`,
              }}
            >
              {/* Colored accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${node.color}60, transparent)` }}
              />
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[8px] uppercase tracking-widest" style={{ color: `${node.color}90` }}>
                  {node.category}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-white/65 line-clamp-3 overflow-hidden text-ellipsis m-0">
                {node.excerpt}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default GraphNode;
