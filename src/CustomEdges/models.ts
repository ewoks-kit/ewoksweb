export interface SmoothStepData {
  getAroundProps: { x: number; y: number };
}

export interface SmoothStepParams {
  data: SmoothStepData;
  sourceX?: number;
  sourceY?: number;
  targetX?: number;
  targetY?: number;
}
