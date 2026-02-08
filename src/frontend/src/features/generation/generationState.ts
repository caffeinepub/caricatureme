export interface GenerationInput {
  photoDataUrl: string;
  photoFilename?: string;
}

export interface GenerationResult extends GenerationInput {
  imageUrl: string;
  timestamp: number;
}
