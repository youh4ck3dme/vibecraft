export type OutputSource = 'empty' | 'demo' | 'ai' | 'manual';

export interface VersionRecord {
  id: string;
  label: string;
  source: OutputSource;
  code: string;
  createdAt: string;
}
