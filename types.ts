
export interface Grid {
  timeRange: string;
  duration: string;
  originalText: string;
  dialogue: string;
  visualPrism?: string;
  prompt: string;
  details?: string;
  sfx: string;
}

export interface ShotGroup {
  groupId: number;
  timeRange: string;
  duration: string;
  scene: string;
  characters: string[];
  propInference: string;
  beastInference: string;
  style: string;
  quality: string;
  colorTendency: string;
  grid1: Grid;
  grid2: Grid;
  grid3: Grid;
  grid4: Grid;
  grid5: Grid;
}

export interface Episode {
  episodeNumber: number;
  totalDuration: string;
  groups: ShotGroup[];
  hook: {
    duration: string;
    suspense: string;
    prompt: string;
    sfx: string;
  };
}
