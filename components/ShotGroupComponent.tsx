
import React, { useState } from 'react';
import { ShotGroup } from '../types';
import GridCard from './GridCard';

interface ShotGroupProps {
  group: ShotGroup;
  characterAliases: Record<string, string>;
  sceneAliases: Record<string, string>;
}

const ShotGroupComponent: React.FC<ShotGroupProps> = ({ group, characterAliases, sceneAliases }) => {
  const [showMergeModal, setShowMergeModal] = useState(false);

  const getAlias = (name: string) => characterAliases[name] || name;
  const getSceneAlias = (scene: string) => sceneAliases[scene] || scene;

  const grids = [
    { key: "grid1", title: "Grid 1 (Anchor) - 入场与建立", data: group.grid1, role: "Anchor" },
    { key: "grid2", title: "Grid 2 (Inheritance) - 承接与推进", data: group.grid2, role: "Inheritance" },
    { key: "grid3", title: "Grid 3 (Detail) - 细节炸裂 (Micro-World)", data: group.grid3, role: "Detail" },
    { key: "grid4", title: "Grid 4 (Climax) - 高潮与张力 (Sakuga Moment)", data: group.grid4, role: "Climax" },
    { key: "grid5", title: "Grid 5 (Reaction) - 反应与余韵 (Breathing Protocol)", data: group.grid5, role: "Reaction" },
  ];

  const formatGridContent = (g: any, index: number) => {
    const { data, title, role } = g;
    const gridTitle = title.split('-')[1]?.trim() || '';
    return `#### **Grid ${index + 1} (${role}) - ${gridTitle}**
*   **时间分配**: [${data.timeRange}] | **镜头时长**: [${data.duration} 秒]
*   **台词**: ${data.dialogue && data.dialogue !== "无" ? data.dialogue : '[无]'}
${data.visualPrism ? `*   **视觉棱镜**: ${data.visualPrism}` : ''}

**视频提示词 (中文):**
**[画面描述]**: ${data.prompt}
${data.details ? `**[细节推演]**: ${data.details}` : ''}

**音效**: ${data.sfx}

---`;
  };

  // Build clean text for preview without "Original Text" and ensuring aliased scene/characters are used
  const fullPromptTextClean = `场景: ${getSceneAlias(group.scene)}
角色: ${group.characters.map(c => getAlias(c)).join(', ')}

${grids.map((g, i) => formatGridContent(g, i)).join('\n\n')}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullPromptTextClean);
    alert('分镜汇总脚本已成功合并并复制。');
  };

  return (
    <div id={`group-${group.groupId}`} className="relative pl-0 w-full scroll-mt-96 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="mb-20">
        {/* 三栏布局 Header: [Production Script Preview] | [Master Title] | [Action Terminal] */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-12 mb-20 border-b border-white/5 pb-16">
          
          {/* Left Column: Production Script Preview (Summary Text) */}
          <div className="flex-1 space-y-4">
             <div className="flex items-center space-x-3 mb-6">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">生产脚本预览 (PRODUCTION LOG)</span>
             </div>
             <div className="bg-[#0a0a0a] p-8 border border-white/5 rounded-sm relative group/log min-h-[160px] hover:border-[#d4af37]/20 transition-all overflow-hidden">
                <p className="text-gray-500 text-[11px] font-light leading-relaxed font-mono line-clamp-6 opacity-60">
                  {fullPromptTextClean}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                   <button onClick={copyToClipboard} className="text-[9px] text-[#d4af37]/50 hover:text-[#d4af37] uppercase tracking-[0.3em] font-bold transition-all flex items-center">
                    <i className="fa-solid fa-copy mr-2"></i> 复制完整汇总
                   </button>
                </div>
             </div>
          </div>

          {/* Center Column: Master Title & Scene Details */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-4">
            <div className="flex items-center space-x-6 mb-2">
               <div className="w-3 h-3 bg-[#d4af37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
               <h2 className="cinzel text-6xl md:text-8xl font-bold text-white tracking-[0.5em] uppercase leading-none opacity-90">
                 SHOT <span className="text-[#d4af37]">GROUP {group.groupId.toString().padStart(2, '0')}</span>
               </h2>
            </div>
            <div className="space-y-4">
               <div className="flex flex-col items-center space-y-1">
                 <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">当前场景:</span>
                 <p className="text-white text-3xl font-light tracking-[0.15em] leading-tight">{getSceneAlias(group.scene)}</p>
               </div>
               <p className="text-gray-500 text-[10px] font-bold tracking-[0.6em] uppercase px-6 py-2 border border-white/10 inline-block rounded-sm bg-white/[0.02]">
                 {group.style} / CINEMATIC {group.quality}
               </p>
            </div>
            <div className="flex items-center space-x-8 pt-4">
               <div className="flex items-center space-x-2">
                 <i className="fa-regular fa-clock text-[10px] text-gray-600"></i>
                 <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{group.timeRange}</span>
               </div>
               <div className="h-[1px] w-12 bg-white/5"></div>
               <div className="flex items-center space-x-2">
                 <i className="fa-regular fa-user text-[10px] text-gray-600"></i>
                 <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{group.characters.map(c => getAlias(c)).join(' • ')}</span>
               </div>
            </div>
          </div>

          {/* Right Column: Action Terminal & Mapping Sync */}
          <div className="flex-1 flex flex-col items-end justify-between py-2">
             <div className="flex flex-col items-end space-y-2 mb-8">
               <div className="flex items-center space-x-3">
                 <span className="text-[10px] text-[#d4af37]/60 uppercase tracking-[0.5em] font-bold">同步映射活跃 (SYNC ACTIVE)</span>
                 <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_8px_#d4af37]"></div>
               </div>
               <span className="text-[8px] text-gray-700 font-mono tracking-widest uppercase">Real-Time Production Buffer</span>
             </div>
             <div className="flex flex-col space-y-4 w-full max-w-[300px]">
                <button 
                  onClick={() => setShowMergeModal(true)}
                  className="group flex items-center justify-center space-x-4 bg-transparent hover:bg-white/5 text-gray-300 border border-white/10 px-8 py-5 rounded-sm transition-all duration-300 font-bold tracking-[0.4em] uppercase text-[11px]"
                >
                  <i className="fa-solid fa-scroll text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors"></i>
                  <span>汇总全案 (MERGE)</span>
                </button>
                <button className="group flex items-center justify-center space-x-4 bg-[#d4af37] text-black px-8 py-6 rounded-sm transition-all duration-300 font-bold tracking-[0.5em] uppercase text-[11px] shadow-2xl hover:bg-[#e0bc4a] active:scale-95 transform">
                  <i className="fa-solid fa-play-circle text-xl group-hover:scale-110 transition-transform"></i>
                  <span>导演预演预览</span>
                </button>
             </div>
          </div>
        </div>

        {/* 底部详情 Metadata (Environment/Cast) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
           <div className="bg-[#0a0a0a] p-12 border border-white/5 rounded-sm hover:border-white/10 transition-colors">
             <div className="flex items-center space-x-3 mb-8">
               <div className="w-1 h-8 bg-[#d4af37]/40"></div>
               <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.6em]">环境与主体档案 (ENVIRONMENT)</span>
             </div>
             <p className="text-white text-4xl font-light leading-snug tracking-wider">{getSceneAlias(group.scene)}</p>
           </div>
           <div className="bg-[#0a0a0a] p-12 border border-white/5 rounded-sm hover:border-white/10 transition-colors">
             <div className="flex items-center space-x-3 mb-8">
               <div className="w-1 h-8 bg-[#d4af37]/40"></div>
               <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.6em]">角色清单 (CAST LIST)</span>
             </div>
             <p className="text-white text-4xl font-light tracking-widest leading-snug">{group.characters.map(c => getAlias(c)).join(' • ')}</p>
           </div>
        </div>
      </div>

      {/* 分镜五宫格横向滚动 */}
      <div className="flex flex-row overflow-x-auto pb-24 gap-12 no-scrollbar snap-x w-full">
        {grids.map((g, idx) => (
          <div key={idx} className="snap-start flex-shrink-0 w-full md:w-[calc(50%-3rem)] lg:w-[calc(20%-2.5rem)]">
            <GridCard index={idx + 1} title={g.role} data={g.data} />
          </div>
        ))}
      </div>

      {/* 沉浸式汇总 Dialog (Merge Modal) */}
      {showMergeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 lg:p-24 animate-in fade-in zoom-in duration-500">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={() => setShowMergeModal(false)}></div>
          <div className="relative w-full h-full max-w-[1720px] max-h-[92vh] bg-[#050505] border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl">
            
            <div className="px-16 py-12 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center space-x-12">
                <div className="w-16 h-16 bg-white/5 rounded-sm flex items-center justify-center border border-white/10">
                  <i className="fa-solid fa-scroll text-[#d4af37] text-3xl"></i>
                </div>
                <div>
                  <h3 className="cinzel text-5xl font-bold tracking-[0.8em] text-white uppercase">生产汇总全案</h3>
                  <p className="text-[12px] text-gray-600 uppercase tracking-widest mt-3">Shot Group Master Production Specifications</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMergeModal(false)}
                className="group flex items-center space-x-6 bg-transparent hover:bg-white/5 px-12 py-6 rounded-sm transition-all border border-white/10 text-gray-400"
              >
                <i className="fa-solid fa-arrow-left text-[#d4af37] transition-transform group-hover:-translate-x-2"></i>
                <span className="text-[12px] font-bold tracking-[0.5em] uppercase">返回编辑</span>
              </button>
            </div>
            
            <div className="flex-grow flex overflow-hidden">
              <div className="w-1/4 border-r border-white/5 bg-black overflow-y-auto p-16 space-y-12 custom-scrollbar">
                <span className="text-[12px] text-gray-600 font-bold uppercase tracking-[0.6em] block mb-12">分镜快照 (INDEX)</span>
                {grids.map((g, i) => (
                  <div key={i} className="bg-white/[0.01] p-12 border border-white/5 space-y-6 opacity-40 hover:opacity-100 transition-opacity cursor-default hover:border-[#d4af37]/30">
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                      <span className="text-[12px] text-[#d4af37] font-bold uppercase">Grid 0{i+1}</span>
                      <span className="text-[11px] text-gray-700 font-mono tracking-[0.2em]">{g.data.timeRange}</span>
                    </div>
                    <p className="text-base text-gray-500 line-clamp-3 font-light leading-relaxed italic">"{g.data.prompt}"</p>
                  </div>
                ))}
              </div>

              <div className="flex-grow bg-[#050505] overflow-y-auto p-24 custom-scrollbar">
                <div className="max-w-5xl mx-auto space-y-48">
                   <div className="border-b border-[#d4af37]/10 pb-24 mb-24">
                     <h4 className="cinzel text-[#d4af37] text-7xl font-bold tracking-[0.8em] uppercase mb-16">Production Master</h4>
                     <div className="flex flex-col space-y-8 text-[12px] text-gray-600 font-bold uppercase tracking-[0.6em]">
                       <div className="flex items-center space-x-10">
                          <span className="w-32 opacity-30">GROUP_ID:</span>
                          <span className="text-white text-lg tracking-widest">#{group.groupId.toString().padStart(2, '0')}</span>
                       </div>
                       <div className="flex items-center space-x-10">
                          <span className="w-32 opacity-30">SCENE_NAM:</span>
                          <span className="text-white text-lg tracking-widest">{getSceneAlias(group.scene)}</span>
                       </div>
                       <div className="flex items-center space-x-10">
                          <span className="w-32 opacity-30">CAST_LIST:</span>
                          <span className="text-white text-lg tracking-widest">{group.characters.map(c => getAlias(c)).join(', ')}</span>
                       </div>
                     </div>
                   </div>

                   {grids.map((g, i) => (
                     <div key={i} className="space-y-16 pb-32 border-b border-white/5 last:border-none animate-in fade-in duration-1000" style={{ animationDelay: `${i * 200}ms` }}>
                        <div className="flex items-center space-x-12">
                           <span className="cinzel text-[#d4af37] text-6xl font-bold opacity-10">0{i+1}</span>
                           <h5 className="text-3xl text-white font-bold tracking-[0.6em] uppercase">{g.title}</h5>
                        </div>
                        <div className="pl-32 space-y-20">
                           <div className="flex space-x-16 text-[12px] text-gray-600 font-mono tracking-[0.3em]">
                             <span className="bg-white/5 px-8 py-3 rounded-sm border border-white/5">RANGE: {g.data.timeRange}</span>
                             <span className="bg-white/5 px-8 py-3 rounded-sm border border-white/5">DUR: {g.data.duration}s</span>
                           </div>
                           
                           <div className="space-y-16">
                             {g.data.dialogue && g.data.dialogue !== "无" && (
                               <div className="space-y-6">
                                 <span className="text-[11px] text-blue-500/30 font-bold uppercase tracking-[0.6em] block">角色对白 (VOICE OVER):</span>
                                 <p className="text-blue-100/70 italic text-3xl font-light leading-relaxed border-l border-blue-500/10 pl-12">"{g.data.dialogue}"</p>
                               </div>
                             )}

                             <div className="bg-white/[0.01] p-20 rounded-sm border border-white/10 space-y-12">
                                <div className="space-y-6">
                                  <span className="text-[11px] text-[#d4af37] font-bold uppercase tracking-[0.6em] block">视觉指令词 (PRODUCTION PROMPT):</span>
                                  <p className="text-white text-4xl font-extralight italic leading-relaxed tracking-[0.05em]">"{g.data.prompt}"</p>
                                </div>
                                {g.data.visualPrism && (
                                   <div className="pt-12 border-t border-white/5">
                                      <span className="text-[11px] text-[#d4af37]/30 font-bold uppercase tracking-[0.6em] block mb-6">视觉棱镜 (VISUAL PRISM):</span>
                                      <p className="text-[#d4af37]/80 text-xl font-medium tracking-[0.15em] leading-relaxed">{g.data.visualPrism}</p>
                                   </div>
                                )}
                             </div>
                             
                             <div className="flex items-center space-x-8 text-gray-600 text-[12px] uppercase font-mono tracking-[0.4em] bg-white/5 w-fit px-10 py-4 border border-white/5">
                                <i className="fa-solid fa-waveform-lines text-[#d4af37]/40 text-lg"></i>
                                <span>SFX SPEC: {g.data.sfx}</span>
                             </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="w-1/4 border-l border-white/5 bg-black overflow-y-auto p-20 space-y-20 custom-scrollbar">
                <span className="text-[12px] text-gray-600 font-bold uppercase tracking-[0.6em] block mb-16">剧本原始参照 (REFERENCE)</span>
                {grids.map((g, i) => (
                  <div key={i} className="space-y-8 animate-in fade-in duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="text-[11px] text-gray-800 font-bold uppercase tracking-[0.5em] block border-b border-white/5 pb-6">SEGMENT {i+1}</span>
                    <p className="text-base text-gray-500 leading-relaxed font-light italic tracking-wide">"{g.data.originalText}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-16 py-12 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
              <div className="text-sm text-gray-600 max-w-3xl leading-relaxed italic font-light tracking-widest uppercase">
                当前汇总全案已针对 Cinema 8K 分镜工作流进行了视觉与指令集增强优化。
              </div>
              <button 
                onClick={copyToClipboard}
                className="bg-[#d4af37] hover:bg-[#e0bc4a] text-black font-bold px-28 py-10 rounded-sm cinzel tracking-[0.6em] text-2xl transition-all shadow-2xl flex items-center transform hover:scale-[1.03] active:scale-[0.97] duration-300"
              >
                <i className="fa-solid fa-copy mr-8 text-2xl"></i>
                复制全量 Markdown 汇总
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShotGroupComponent;
