import React from 'react';
import { Code, Briefcase, Mail, Globe, Terminal } from 'lucide-react';

export default function Topbar() {
  const socialLinks = [
    { name: 'GitHub', icon: Code, href: 'https://github.com/N1borg' },
    { name: 'LinkedIn', icon: Briefcase, href: 'https://linkedin.com/in/robin-caboche' },
    { name: 'TryHackMe', icon: Globe, href: 'https://tryhackme.com/p/Niborg' },
    { name: 'Email', icon: Mail, href: 'mailto:robin.caboche@epitech.eu' },
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-30 pointer-events-auto">
      <div 
        className="w-full flex items-center justify-between px-8 py-5 border-b border-white/[0.04]"
        style={{
          background: 'linear-gradient(to bottom, rgba(3,3,3,0.8), rgba(3,3,3,0))',
          backdropFilter: 'blur(12px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
        }}
      >
        {/* Branding */}
        <div>
          <h1 className="text-lg font-light tracking-[0.25em] uppercase text-white/80">
            Proof of Work
          </h1>
          <p className="text-[10px] text-white/30 tracking-[0.15em] mt-1">
            Robin Caboche — Interactive Portfolio
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/80 transition-colors flex items-center gap-2 group"
              title={link.name}
            >
              <link.icon size={18} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wider hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity absolute right-6 top-16 bg-black/60 px-3 py-1.5 rounded backdrop-blur-md border border-white/10 pointer-events-none">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
