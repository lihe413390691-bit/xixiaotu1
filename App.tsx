
import React, { useState } from 'react';
import Header from './components/Header';
import { generateStoryboard } from './services/geminiService';
import { Episode } from './types';
import ShotGroupComponent from './components/ShotGroupComponent';

const SAMPLE_SCRIPT = `场景：迷雾森林。环境清冷，树枝挂满冰凌。
角色：星绒（灵动的少女），白冥（深沉的守护者）。
星绒 缓缓从冰晶草地坐起，揉了揉惺忪的睡眼，脖子上的冰晶项链发出幽蓝的光。
白冥 站在远处的古木阴影下，目光如炬，手中的长剑隐隐发出龙吟。
星绒 突然听到了树丛深处的异动，惊恐地回头。
一群 幻影狼 悄然包围了她，利齿散发着寒气。
白冥 瞬移至星绒身前，剑光如虹，将迷雾撕裂。`;

const App: React.FC = () => {
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [characterAliases, setCharacterAliases] = useState<Record<string, string>>({});
  const [sceneAliases, setSceneAliases] = useState<Record<string, string>>({});
  const [activeGroup, setActiveGroup] = useState<number>(1);

  const loadSample = () => {
    setScript(SAMPLE_SCRIPT);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!script.trim()) {
      setError('请输入剧本内容后再启动预演。');
      return;
    }
    
    setLoading(true);
    setError(null);
    setCharacterAliases({}); 
    setSceneAliases({});
    try {
      const result = await generateStoryboard(script);
      setEpisode(result);
    } catch (err: any) {
      setError(err.message || '分镜解析失败，请检查网络或配置。');
    } finally {
      setLoading(false);
    }
  };

  const handleAliasChange = (original: string, alias: string) => {
    setCharacterAliases(prev => ({
      ...prev,
      [original]: alias
    }));
  };

  const handleSceneAliasChange = (original: string, alias: string) => {
    setSceneAliases(prev => ({
      ...prev,
      [original]: alias
    }));
  };

  const syncAliases = () => {
    const charCount = Object.keys(characterAliases).filter(k => characterAliases[k]).length;
    const sceneCount = Object.keys(sceneAliases).filter(k => sceneAliases[k]).length;
    if (charCount === 0 && sceneCount === 0) return;
    alert(`同步成功：已将 ${charCount} 个角色映射与 ${sceneCount} 个场景映射应用至全量分镜汇总。`);
  };

  const scrollToGroup = (id: number) => {
    setActiveGroup(id);
    const element = document.getElementById(`group-${id}`);
    if (element) {
      const yOffset = -220; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const allCharacters = episode ? Array.from(new Set(episode.groups.flatMap(g => g.characters))) : [];
  const allScenes = episode ? Array.from(new Set(episode.groups.map(g => g.scene))) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#d1d5db] font-sans">
      <Header />
      
      <main className="flex-grow p-6 md:p-12 lg:p-24 max-w-[1920px] mx-auto w-full">
        {error && (
          <div className="max-w-4xl mx-auto mb-16 p-6 bg-red-950/10 border border-red-500/20 text-red-400 rounded-sm flex items-center justify-between animate-in fade-in duration-500">
            <div className="flex items-center space-x-4">
              <i className="fa-solid fa-circle-exclamation text-red-500"></i>
              <span className="text-sm tracking-widest uppercase font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="hover:text-red-300 transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {!episode && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-40 space-y-32">
            <div className="text-center space-y-12 max-w-5xl">
              <h2 className="cinzel text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-white leading-[0.85] uppercase">
                THE UNLIMITED <br/><span className="text-[#d4af37]">DIRECTOR</span>
              </h2>
              <p className="text-gray-500 font-light text-xl md:text-3xl px-8 max-w-4xl mx-auto leading-relaxed tracking-[0.1em]">
                顶级 AI 动画导演。将文学剧本转化为高维视觉生产蓝图。
              </p>
            </div>

            <div className="w-full max-w-5xl bg-[#0a0a0a] p-10 md:p-20 border border-white/5 rounded-sm relative">
              <div className="flex justify-between items-center mb-12">
                <span className="text-[10px] text-gray-600 uppercase tracking-[0.6em] font-bold">Input Script Terminal</span>
                <button 
                  onClick={loadSample}
                  className="text-[10px] text-[#d4af37] border-b border-[#d4af37]/30 hover:border-[#d4af37] pb-1 transition-all uppercase tracking-[0.2em] font-bold"
                >
                  载入示例剧本
                </button>
              </div>
              
              <textarea
                className="w-full h-[400px] bg-transparent text-white p-0 border-none focus:ring-0 outline-none resize-none font-light placeholder-gray-800 transition-all text-xl md:text-3xl leading-relaxed scrollbar-none"
                placeholder="在此粘贴剧本内容，开启视觉重构..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />

              <div className="mt-20 pt-10 border-t border-white/5 flex justify-end">
                <button
                  onClick={handleGenerate}
                  className="group relative inline-flex items-center justify-center px-16 py-6 font-bold text-black transition-all duration-300 bg-[#d4af37] rounded-sm cinzel tracking-[0.5em] text-2xl hover:bg-[#d4af37]/90 active:scale-95 transform"
                >
                  启动导演预演
                </button>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-60 space-y-16">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-t-[#d4af37] rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-6">
              <h3 className="cinzel text-4xl text-white font-bold tracking-[0.6em] uppercase">维度渲染中</h3>
              <p className="text-gray-600 font-light tracking-[0.3em] text-xl">正在解析剧本的物理轨迹与视听张力</p>
            </div>
          </div>
        ) : episode ? (
          <div className="space-y-40 animate-in fade-in duration-1000">
            {/* 极简固态导航 */}
            <div className="sticky top-[89px] z-[45] -mx-4 md:-mx-12 lg:-mx-24 px-4 md:px-12 lg:px-24 bg-[#050505]/95 backdrop-blur-sm border-b border-white/5 py-8 flex flex-col space-y-8 shadow-2xl">
               <div className="flex items-center justify-between">
                 <div className="flex flex-col space-y-4">
                   <div className="flex items-center space-x-3">
                     <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">跳转至分镜组 (Production Grid)</span>
                     <div className="h-[1px] w-12 bg-white/10"></div>
                   </div>
                   <div className="flex items-center space-x-2">
                      {episode.groups.map(g => (
                        <button 
                          key={g.groupId}
                          onClick={() => scrollToGroup(g.groupId)}
                          className={`w-12 h-12 rounded-sm font-mono text-xs font-bold transition-all duration-300 border flex items-center justify-center
                            ${activeGroup === g.groupId 
                              ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[0_10px_20px_rgba(212,175,55,0.15)] scale-110 z-10' 
                              : 'bg-white/5 text-gray-600 border-white/5 hover:border-[#d4af37]/50 hover:text-white hover:scale-105'}`}
                        >
                          {g.groupId.toString().padStart(2, '0')}
                        </button>
                      ))}
                   </div>
                 </div>
                 <div className="flex items-center space-x-10">
                    <button 
                      onClick={() => setEpisode(null)}
                      className="text-[#d4af37] border border-[#d4af37]/20 hover:bg-[#d4af37]/5 px-8 py-3 rounded-sm transition-all text-[10px] font-bold tracking-[0.4em] uppercase"
                    >
                      重置剧本项目
                    </button>
                 </div>
               </div>

               {/* 资产映射面板 (角色与场景) */}
               <div className="bg-[#0a0a0a] p-10 border border-white/5 rounded-sm space-y-12">
                 <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.5em]">剧中资产映射系统 (角色 & 场景)</span>
                    <button 
                      onClick={syncAliases}
                      className="text-[10px] text-[#d4af37] border-b border-[#d4af37]/20 hover:border-[#d4af37] pb-1 transition-all uppercase font-bold tracking-widest"
                    >
                      同步映射
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-2">
                    {/* 角色映射 */}
                    <div className="space-y-6">
                      <span className="text-[9px] text-gray-600 uppercase font-mono tracking-widest block border-l-2 border-[#d4af37]/30 pl-4">Characters</span>
                      <div className="flex flex-wrap gap-10">
                        {allCharacters.map((char, idx) => (
                          <div key={idx} className="flex items-center space-x-6 min-w-[280px]">
                            <div className="flex flex-col min-w-[100px]">
                              <span className="text-[8px] text-gray-700 uppercase font-mono">Original:</span>
                              <span className="text-sm text-white font-medium">{char}</span>
                            </div>
                            <i className="fa-solid fa-arrow-right-long text-gray-800 text-[10px]"></i>
                            <div className="flex flex-col flex-grow">
                               <span className="text-[8px] text-[#d4af37]/40 uppercase font-mono">Alias:</span>
                               <input 
                                type="text" 
                                className="bg-transparent text-white border-b border-gray-900 focus:border-[#d4af37] outline-none text-sm py-1 transition-all w-full font-light"
                                placeholder="更名角色..."
                                value={characterAliases[char] || ''}
                                onChange={(e) => handleAliasChange(char, e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 场景映射 */}
                    <div className="space-y-6">
                      <span className="text-[9px] text-gray-600 uppercase font-mono tracking-widest block border-l-2 border-blue-500/30 pl-4">Scenes</span>
                      <div className="flex flex-wrap gap-10">
                        {allScenes.map((scene, idx) => (
                          <div key={idx} className="flex items-center space-x-6 min-w-[280px]">
                            <div className="flex flex-col min-w-[100px]">
                              <span className="text-[8px] text-gray-700 uppercase font-mono">Original:</span>
                              <span className="text-sm text-white font-medium truncate max-w-[120px]">{scene}</span>
                            </div>
                            <i className="fa-solid fa-arrow-right-long text-gray-800 text-[10px]"></i>
                            <div className="flex flex-col flex-grow">
                               <span className="text-[8px] text-[#d4af37]/40 uppercase font-mono">Alias:</span>
                               <input 
                                type="text" 
                                className="bg-transparent text-white border-b border-gray-900 focus:border-[#d4af37] outline-none text-sm py-1 transition-all w-full font-light"
                                placeholder="更名场景..."
                                value={sceneAliases[scene] || ''}
                                onChange={(e) => handleSceneAliasChange(scene, e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="space-y-60 pb-40">
              {episode.groups.map((group) => (
                <ShotGroupComponent 
                  key={group.groupId} 
                  group={group} 
                  characterAliases={characterAliases}
                  sceneAliases={sceneAliases}
                />
              ))}
            </div>
            
            {/* 黄金钩子悬念 */}
            <div className="py-60 text-center border-t border-white/5">
              <h3 className="cinzel text-4xl text-[#d4af37] font-bold tracking-[0.6em] uppercase mb-16">The Golden Hook</h3>
              <div className="max-w-4xl mx-auto p-20 bg-[#0a0a0a] border border-white/5 rounded-sm space-y-10">
                <p className="text-4xl italic text-white font-light leading-relaxed">"{episode.hook.suspense}"</p>
                <div className="flex items-center justify-center space-x-6 text-gray-600 font-mono text-xs uppercase tracking-[0.4em]">
                  <i className="fa-solid fa-waveform-lines text-[#d4af37]/30"></i>
                  <span>SFX: {episode.hook.sfx}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <footer className="py-24 border-t border-white/5 bg-black">
        <div className="max-w-[1600px] mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="cinzel text-[#d4af37] font-bold tracking-[0.5em] text-2xl opacity-40">THE UNLIMITED DIRECTOR</div>
          <p className="text-gray-700 text-[10px] tracking-[1.2em] uppercase font-light text-center">
            PRECISION CINEMATOGRAPHY | POWERED BY GEMINI 3 | VER 3.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
