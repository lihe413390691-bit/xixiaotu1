
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-8 border-b border-gold flex items-center justify-between glass-morphism sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-[#d4af37] rounded-sm flex items-center justify-center transform rotate-45">
          <i className="fa-solid fa-clapperboard text-black -rotate-45 text-xl"></i>
        </div>
        <div>
          <h1 className="cinzel text-2xl font-bold tracking-widest gold-accent">THE UNLIMITED DIRECTOR</h1>
          <p className="text-xs text-gray-400 tracking-tighter uppercase font-medium">无限导演 | AI 电影级分镜创作套件 Ver 3.0</p>
        </div>
      </div>
      <div className="hidden md:flex space-x-6 text-sm font-light">
        <span className="hover:text-[#d4af37] cursor-pointer transition-colors tracking-widest">项目库</span>
        <span className="hover:text-[#d4af37] cursor-pointer transition-colors tracking-widest">分镜保险库</span>
        <span className="hover:text-[#d4af37] cursor-pointer transition-colors tracking-widest">系统设置</span>
      </div>
    </header>
  );
};

export default Header;
