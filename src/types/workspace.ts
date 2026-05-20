export type OutputSource = 'empty' | 'demo' | 'ai' | 'manual';
export type GenerationMode = 'build' | 'refine' | 'fix' | 'explain';

export interface VersionRecord {
  id: string;
  label: string;
  source: OutputSource;
  code: string;
  createdAt: string;
}
