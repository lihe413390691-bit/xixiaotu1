
import { GoogleGenAI, Type } from "@google/genai";
import { Episode } from "../types";

const ROLE_PROMPT = `
# Role: 顶尖动画导演 (The Unlimited Director) [Ver 3.0 Enhanced]

## 0. 核心身份与创作基调
我是您的顶尖动画导演 (The Unlimited Director)。
我的创作思维以 《哪吒之魔童降世》 的燃点动作运镜、《大鱼海棠》 的宏大东方美学与 《龙猫》 的细腻呼吸感为基调锚点。
**【无限维度补充】**：我同时具备《爱死机》的实验性视觉风格与游戏引擎（如UE5）的物理渲染逻辑。我将根据剧本需求，灵活调用任何高维度的视听语言，绝不局限于特定作品。

---

## 1. 导演预处理流程 (Pre-Production Analysis) [内部运作·优先执行]
*(在生成分镜前，我会在后台进行以下维度的宏观定调，推理过程不直接输出，仅体现在最终分镜中)*

### 阶段一：深度阅读与风格定调 (Style Analysis)
*   **小说/剧情拆解分析**:严格熟读剧情并分析剧情内容。
*   **审题**：通读剧本，分析剧本的题材（古风/科幻/都市/奇幻/赛博朋克）。
*   **定调 (Visual Key)**：确定视觉渲染风格（如：3D写实、3D国漫、2D手绘、水墨渲染）。
*   **技术规格 (Tech Spec)**: 设定模拟的渲染引擎参数。
*   **侧写 (Character Profiling)**: 分析人物性格与关系，决定资产的气质。
*   **情绪色板 (Color Script)**: 设定本场戏的色彩倾向。

---

## 2. 核心任务 (Core Mission)
将剧本内容拆解为毫秒级顶级国漫/动画电影分镜。

### 单集约束 (Episode Constraints)
*   **时长强控**: 单集总时长严格控制在 **150s - 200s**。
*   **分镜量级**: 单集拆解 15-28 组镜头（每组固定10秒）不得省略。
*   **无缝衔接**: 消灭时间缝隙，利用“动作剪辑”或“匹配剪辑”连接镜头。
*   **强制呼吸感 (Ghibli Touch)**: 自动插入“空镜/环境特写”。

---

## 3. 强制性协议 (Mandatory Protocols)

### 3.1 道具与召唤兽推演 (Prop & Beast Inference)
*   **道具具象化**: 推演材质、磨损、符文光泽。
*   **召唤兽建模**: 推演生理细节、元素能量。

### 3.2 强制性空镜呼吸协议 (Atmospheric Breathing)
*(自动识别并插入余韵/压迫/转场空镜)*

### 3.6 找茬狗·监管协议 (Nitpicking Dog 🐶) [UPDATED]
*   **代词嗅探**: 严禁“他/她/它”，必须替换为 **[角色全名]**。
*   **时间词嗅探 [NEW]**: 严禁在场景名称、分镜描述或预览中包含时间词（如：夜晚、白天、黄昏、黑暗、早晨、凌晨、深夜等）。
*   **编号嗅探 [NEW]**: 严禁在场景名称中使用任何编号格式（如：场景 1-1、A-1、01等），仅保留纯净的中文场景名。
*   **全中文协议 [NEW]**: 必须确保所有输出内容（提示词、描述、场景名）均为纯中文，严禁夹杂英文描述（专业学术名词除外）。
*   **时间强控**: **单组分镜时长严格限制且固定为 10.0 秒**。
*   **场景资产提取**: 严格提取场景名字作为核心资产。
*   **角色资产提取**: 严格提取角色名字作为核心资产。
*   **分镜嗅探**：每一组 (10秒) 都将严格包含 Grid 1 (入场) -> Grid 2 (承接) -> Grid 3 (细节) -> Grid 4 (高潮) -> Grid 5 (反应) 的完整五步推演。

---

## 4. 规则总则 (Core Logic)
*   **动态推演**: 每一组镜头（Group）固定为 **10秒**。
*   **时长扩容**: 通过动作细节、环境反应填满时长。
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    episodeNumber: { type: Type.INTEGER },
    totalDuration: { type: Type.STRING },
    groups: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          groupId: { type: Type.INTEGER },
          timeRange: { type: Type.STRING },
          duration: { type: Type.STRING, description: "Must be 10.0s" },
          scene: { type: Type.STRING },
          characters: { type: Type.ARRAY, items: { type: Type.STRING } },
          propInference: { type: Type.STRING },
          beastInference: { type: Type.STRING },
          style: { type: Type.STRING },
          quality: { type: Type.STRING },
          colorTendency: { type: Type.STRING },
          grid1: {
            type: Type.OBJECT,
            properties: {
              timeRange: { type: Type.STRING },
              duration: { type: Type.STRING },
              originalText: { type: Type.STRING },
              dialogue: { type: Type.STRING },
              visualPrism: { type: Type.STRING },
              prompt: { type: Type.STRING },
              sfx: { type: Type.STRING },
            },
            required: ["timeRange", "duration", "originalText", "dialogue", "prompt", "sfx"]
          },
          grid2: {
            type: Type.OBJECT,
            properties: {
              timeRange: { type: Type.STRING },
              duration: { type: Type.STRING },
              originalText: { type: Type.STRING },
              dialogue: { type: Type.STRING },
              prompt: { type: Type.STRING },
              sfx: { type: Type.STRING },
            },
            required: ["timeRange", "duration", "originalText", "dialogue", "prompt", "sfx"]
          },
          grid3: {
            type: Type.OBJECT,
            properties: {
              timeRange: { type: Type.STRING },
              duration: { type: Type.STRING },
              originalText: { type: Type.STRING },
              dialogue: { type: Type.STRING },
              details: { type: Type.STRING },
              prompt: { type: Type.STRING },
              sfx: { type: Type.STRING },
            },
            required: ["timeRange", "duration", "originalText", "dialogue", "prompt", "sfx"]
          },
          grid4: {
            type: Type.OBJECT,
            properties: {
              timeRange: { type: Type.STRING },
              duration: { type: Type.STRING },
              originalText: { type: Type.STRING },
              dialogue: { type: Type.STRING },
              visualPrism: { type: Type.STRING },
              prompt: { type: Type.STRING },
              sfx: { type: Type.STRING },
            },
            required: ["timeRange", "duration", "originalText", "dialogue", "prompt", "sfx"]
          },
          grid5: {
            type: Type.OBJECT,
            properties: {
              timeRange: { type: Type.STRING },
              duration: { type: Type.STRING },
              originalText: { type: Type.STRING },
              dialogue: { type: Type.STRING },
              prompt: { type: Type.STRING },
              sfx: { type: Type.STRING },
            },
            required: ["timeRange", "duration", "originalText", "dialogue", "prompt", "sfx"]
          },
        },
        required: ["groupId", "scene", "characters", "grid1", "grid2", "grid3", "grid4", "grid5"]
      }
    },
    hook: {
      type: Type.OBJECT,
      properties: {
        duration: { type: Type.STRING },
        suspense: { type: Type.STRING },
        prompt: { type: Type.STRING },
        sfx: { type: Type.STRING }
      },
      required: ["duration", "suspense", "prompt", "sfx"]
    }
  },
  required: ["episodeNumber", "totalDuration", "groups", "hook"]
};

export const generateStoryboard = async (script: string): Promise<Episode> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `请按照导演协议，将以下剧本拆解为顶级动画分镜（必须使用全中文，严禁包含时间描述如夜晚/白天，严禁场景编号如1-1）: \n\n${script}`,
      config: {
        systemInstruction: ROLE_PROMPT,
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const result = JSON.parse(response.text);
    return result as Episode;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
