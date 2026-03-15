import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import jecLogo from '@/assets/jec-logo.png';
import amritMahotsavLogo from '@/assets/amrit-mahotsav.png';
import { LogOut, Phone, Mail, Menu, X, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'SYS_HOME' },
    { to: '/public-feed', label: 'PUBLIC_STREAM' },
    { to: '/about', label: 'ABOUT_NODE' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-[0_4px_30px_rgba(57,255,20,0.1)] border-b border-[#39ff14]/20 bg-black/80 backdrop-blur-lg">
      {/* 1. Holographic Header Display */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4 lg:px-12 gap-6 w-full relative overflow-hidden">
        {/* Decorative Grid Top */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #39ff14 1px, transparent 1px), linear-gradient(to bottom, #39ff14 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        {/* Left Section (College Logo) */}
        <div className="flex-shrink-0 relative z-10 filter drop-shadow-[0_0_10px_rgba(57,255,20,0.4)]">
          <img src={jecLogo} alt="JEC Logo" className="w-20 h-20 md:w-24 md:h-24 object-contain brightness-125" />
        </div>
        
        {/* Center Section (Data Terminal Text) */}
        <div className="flex flex-col text-center justify-center flex-1 relative z-10">
          <h2 className="text-[10px] md:text-xs font-mono font-bold text-[#ccff00] tracking-widest uppercase mb-1 flex items-center justify-center gap-2">
            <Terminal className="w-3 h-3" /> जबलपुर अभियांत्रिकी महाविद्यालय, जबलपुर (म.प्र.)
          </h2>
          <h1 className="text-sm md:text-xl font-mono font-extrabold text-[#39ff14] tracking-[0.2em] uppercase text-shadow-md">
            Jabalpur Engineering College
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mt-2 text-[8px] md:text-[9px] font-mono text-[#39ff14]/70 tracking-widest uppercase">
            <span>[EST_1947 :: GOVT_ENGG_COLLEGE]</span>
            <span className="hidden md:inline text-[#ccff00]">|</span>
            <span>[AUTONOMOUS_NODE :: GOVT_OF_MP]</span>
          </div>
        </div>

        {/* Right Section (Amrit Mahotsav Logo) */}
        <div className="flex-shrink-0 relative z-10 filter drop-shadow-[0_0_10px_rgba(204,255,0,0.4)]">
          <img 
            src={amritMahotsavLogo} 
            alt="Amrit Mahotsav Logo" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain brightness-125" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      </div>

      {/* 2. Cyber-Nav Section */}
      <div className="border-t border-[#39ff14]/20 px-4 py-3 flex items-center justify-between min-h-[50px] relative z-10 bg-black/50">
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <nav className="flex gap-8">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-[10px] font-mono tracking-[0.15em] uppercase transition-all duration-300 ${isActive(l.to) ? 'text-[#ccff00] border-b border-[#ccff00] pb-1 shadow-[0_0_10px_rgba(204,255,0,0.5)]' : 'text-[#39ff14]/70 hover:text-[#39ff14]'}`}
              >{l.label}</Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1 flex items-center gap-2 text-[#39ff14]">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="font-mono text-[10px] tracking-widest uppercase">SYS_MENU</span>
        </button>

        {/* User Actions & Support */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-[9px] font-mono tracking-widest text-[#39ff14]/60 uppercase">
            <span className="flex items-center gap-1.5 hover:text-[#39ff14] transition-colors"><Phone className="w-3 h-3" /> +91_7612331953</span>
            <span className="flex items-center gap-1.5 hover:text-[#ccff00] transition-colors"><Mail className="w-3 h-3" /> prinjec.jbp@mp.gov.in</span>
          </div>

          {isAuthenticated && user && (
            <div className="flex items-center gap-4 border-l border-[#39ff14]/30 pl-4">
              <div className="text-right hidden sm:block font-mono">
                <p className="text-[10px] font-bold text-[#ccff00] uppercase tracking-wider">{user.name}</p>
                <p className="text-[8px] text-[#39ff14]/60 uppercase tracking-widest">[{user.role}]</p>
              </div>
              <button onClick={logout} className="btn-quantum text-[9px] px-3 py-1.5 flex items-center gap-1.5">
                <LogOut className="w-3 h-3" /> DISCONNECT
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 border-b border-[#39ff14]/30 px-4 pt-2 pb-4 space-y-2 relative z-20">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              className={`block px-3 py-3 rounded-none text-[10px] font-mono tracking-widest uppercase border border-transparent ${isActive(l.to) ? 'bg-[#39ff14]/10 border-[#39ff14]/30 text-[#ccff00]' : 'text-[#39ff14]/60 hover:text-[#39ff14] hover:bg-[#39ff14]/5 hover:border-[#39ff14]/20'}`}
            >{l.label}</Link>
          ))}
          {isAuthenticated && user && (
            <div className="px-3 py-3 text-[10px] font-mono text-[#39ff14]/50 border-t border-[#39ff14]/20 mt-2 tracking-widest uppercase">
              ACTIVE_SESSION: <span className="text-[#ccff00]">{user.name}</span> [{user.role}]
            </div>
          )}
        </div>
      )}

      {/* Info Ticker */}
      <div className="bg-black/80 border-t border-[#ccff00]/20 py-1 overflow-hidden relative z-10">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
          <span className="text-[#ff073a] text-[9px] font-mono tracking-[0.2em] font-bold uppercase">
            WARN // PROTOTYPE_SIMULATION_ONLY // NOT_OFFICIAL_JEC_SYSTEM // VISUAL_DATA_DEMONSTRATION
          </span>
          <span className="text-[#ff073a] text-[9px] font-mono tracking-[0.2em] font-bold uppercase">
            WARN // PROTOTYPE_SIMULATION_ONLY // NOT_OFFICIAL_JEC_SYSTEM // VISUAL_DATA_DEMONSTRATION
          </span>
        </div>
      </div>
    </header>
  );
}
