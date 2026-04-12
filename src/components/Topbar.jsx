import React from 'react';
import { Code, Briefcase, Mail, Globe } from 'lucide-react';

export default function Topbar({ categories = [] }) {
  const socialLinks = [
    { name: 'GitHub', icon: Code, href: 'https://github.com/N1borg', color: '#a78bfa' },
    { name: 'LinkedIn', icon: Briefcase, href: 'https://linkedin.com/in/robin-caboche', color: '#60a5fa' },
    { name: 'TryHackMe', icon: Globe, href: 'https://tryhackme.com/p/Niborg', color: '#34d399' },
    { name: 'Email', icon: Mail, href: 'mailto:robin.caboche@epitech.eu', color: '#f472b6' },
  ];

  // De-duplicate categories and filter out 'center'
  const uniqueCategories = categories.filter(c => c.name !== 'center');

  return (
    <div className="absolute top-0 left-0 w-full z-30 pointer-events-auto">
      <div
        className="w-full flex items-center justify-between px-8 py-4 border-b border-white/[0.04]"
        style={{
          background: 'linear-gradient(to bottom, rgba(3,3,3,0.85), rgba(3,3,3,0))',
          backdropFilter: 'blur(16px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
        }}
      >
        {/* Left: Branding */}
        <div className="shrink-0">
          <h1 className="text-lg font-light tracking-[0.25em] uppercase text-white/80">
            Proof of Work
          </h1>
          <p className="text-[10px] text-white/30 tracking-[0.15em] mt-1">
            Robin Caboche — Interactive Portfolio
          </p>
        </div>

        {/* Center: Social Links */}
        <div className="hidden sm:flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 group transition-all duration-300"
            >
              <link.icon
                size={20}
                strokeWidth={1.5}
                className="text-white/60 transition-colors duration-300 group-hover:drop-shadow-sm"
                style={{}}
              />
              <span
                className="text-[9px] uppercase tracking-wider text-white/40 transition-colors duration-300"
              >
                {link.name}
              </span>
            </a>
          ))}
        </div>

        {/* Right: Category Legend */}
        {uniqueCategories.length > 0 && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {uniqueCategories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.06]"
                style={{ backgroundColor: `${cat.color}08` }}
              >
                <div
                  className="w-[6px] h-[6px] rounded-full shrink-0"
                  style={{ backgroundColor: cat.color, boxShadow: `0 0 6px ${cat.color}40` }}
                />
                <span className="text-[10px] uppercase tracking-[0.08em] text-white/50 font-medium">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hover color styles for social links */}
      <style>{`
        ${socialLinks.map((link, i) => `
          .hidden.sm\\:flex.items-center.gap-6 > a:nth-child(${i + 1}):hover svg {
            color: ${link.color} !important;
          }
          .hidden.sm\\:flex.items-center.gap-6 > a:nth-child(${i + 1}):hover span {
            color: ${link.color} !important;
          }
        `).join('')}
      `}</style>
    </div>
  );
}
