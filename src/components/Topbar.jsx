import React from 'react';
import { Mail } from 'lucide-react';
import GithubIcon from '../assets/github-icon.svg';
import LinkedinIcon from '../assets/linkedin-icon.svg';
import TryhackmeIcon from '../assets/tryhackme-icon.svg';

export default function Topbar({ categories = [], selectedCategory = null, onCategoryClick = null }) {
  const socialLinks = [
    { name: 'GitHub', icon: GithubIcon, href: 'https://github.com/N1borg', color: '#a78bfa' },
    { name: 'LinkedIn', icon: LinkedinIcon, href: 'https://linkedin.com/in/robin-caboche', color: '#60a5fa' },
    { name: 'TryHackMe', icon: TryhackmeIcon, href: 'https://tryhackme.com/p/Niborg', color: '#34d399' },
    { name: 'Email', icon: Mail, href: 'mailto:robin.caboche@epitech.eu', color: '#f472b6', isLucide: true },
  ];

  // De-duplicate categories and filter out 'center'
  const uniqueCategories = categories.filter(c => c.name !== 'center');

  const handleCategoryClick = (categoryName) => {
    if (onCategoryClick) {
      // Toggle: if clicking the same category, deselect it; otherwise select it
      onCategoryClick(selectedCategory === categoryName ? null : categoryName);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full z-30 pointer-events-auto">
      <div
        className="w-full flex items-center px-8 py-4 border-b border-white/[0.04]"
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
        <div className="hidden sm:flex flex-1 justify-center items-center gap-6 px-8">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 group transition-all duration-300"
            >
              {link.isLucide ? (
                <link.icon
                  size={20}
                  strokeWidth={1.5}
                  className="text-white/60 transition-colors duration-300 group-hover:drop-shadow-sm"
                  style={{}}
                />
              ) : (
                <img
                  src={link.icon}
                  alt={link.name}
                  className="w-5 h-5 social-icon opacity-60 group-hover:opacity-90"
                  style={{
                    filter: 'grayscale(100%)',
                    transition: 'filter 0.3s ease, opacity 0.3s ease',
                  }}
                />
              )}
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
            {uniqueCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 cursor-pointer hover:border-white/[0.12]"
                  style={{
                    backgroundColor: isSelected ? `${cat.color}15` : `${cat.color}08`,
                    borderColor: isSelected ? `${cat.color}60` : 'rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    className="w-[6px] h-[6px] rounded-full shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: cat.color,
                      boxShadow: isSelected ? `0 0 12px ${cat.color}80, 0 0 24px ${cat.color}40` : `0 0 6px ${cat.color}40`
                    }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.08em] font-medium transition-colors duration-300" style={{ color: isSelected ? `${cat.color}ff` : 'rgba(255,255,255,0.5)' }}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Hover color styles for social links */}
      <style>{`
        .group:hover .social-icon {
          filter: grayscale(0%) !important;
        }
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
