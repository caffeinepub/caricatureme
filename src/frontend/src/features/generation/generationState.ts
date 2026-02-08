export interface GenerationInput {
  name: string;
  job: string;
  description: string;
  artStyle: string;
}

export interface GenerationResult extends GenerationInput {
  imageUrl: string;
  timestamp: number;
}
