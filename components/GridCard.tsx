
import React from 'react';
import { Grid } from '../types';

interface GridCardProps {
  index: number;
  data: Grid;
  title: string;
}

const TITLE_MAP: Record<string, string> = {
  "Anchor": "入场与建立",
  "Inheritance": "承接与推进",
  "Detail": "细节炸裂",
  "Climax": "高潮与张力",
  "Reaction": "反应与余韵"
};

const GridCard: React.FC<GridCardProps> = ({ index, data, title }) => {
  return (
    <div className="flex-1 min-w-[340px] border border-white/5 p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-gold/30 transition-all duration-300 group flex flex-col shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-1 rounded">GRID 0{index}</span>
          <h4 className="text-sm font-bold text-white tracking-wide uppercase">{TITLE_MAP[title] || title}</h4>
        </div>
        <span className="text-[10px] text-slate-500 font-mono tracking-tighter">{data.timeRange}</span>
      </div>
      
      <div className="space-y-5 flex-grow">
        {/* 原文部分：轻量化 */}
        <div className="text-[11px] leading-relaxed text-slate-400 border-l border-slate-700 pl-3">
          <span className="text-slate-600 font-bold mr-1 uppercase text-[9px]">Text:</span>
          {data.originalText}
        </div>
        
        {/* 台词：显眼但简洁 */}
        {data.dialogue && data.dialogue !== "无" && (
          <div className="bg-blue-500/5 p-3 rounded-xl text-[12px] border border-blue-500/10 text-blue-200 italic font-light">
            <i className="fa-solid fa-comment-dots mr-2 opacity-40"></i>
            {data.dialogue}
          </div>
        )}

        {/* 提示词核心内容 */}
        <div className="space-y-3">
          <div className="text-xs leading-relaxed">
            <span className="text-gold/60 font-bold block mb-1 uppercase tracking-widest text-[9px]">Video Prompt:</span>
            <p className="text-slate-200 font-light">{data.prompt}</p>
          </div>
          
          <div className="grid grid-cols-1 gap-1.5 opacity-60">
            {data.visualPrism && (
               <div className="flex items-center text-[10px] space-x-2">
                 <span className="text-gold font-bold uppercase min-w-[45px]">Prism:</span>
                 <span className="text-slate-300 truncate">{data.visualPrism}</span>
               </div>
            )}
            {data.details && (
               <div className="flex items-center text-[10px] space-x-2">
                 <span className="text-gold font-bold uppercase min-w-[45px]">Detail:</span>
                 <span className="text-slate-300 truncate">{data.details}</span>
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-2">
          <i className="fa-solid fa-wave-square text-[10px] text-gold"></i>
          <span className="text-[10px] text-slate-400 tracking-tight truncate max-w-[150px]">{data.sfx}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">{data.duration}s</span>
      </div>
    </div>
  );
};

export default GridCard;
