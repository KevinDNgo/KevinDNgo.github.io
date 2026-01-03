export interface Resolution {
  id: string;
  resolutions: string[];
  author: string | null;
  createdAt: number;
  animationProps: {
    startY: number;
    driftY: number;
    rotation: number;
    duration: number;
    delay: number;
    floatDuration: number;
  };
}
