export interface GenerationInput {
  photoDataUrl: string;
  photoFilename?: string;
  style?: string;
}

export interface GenerationResult extends GenerationInput {
  imageUrl: string;
  timestamp: number;
}
