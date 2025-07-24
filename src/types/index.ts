export interface VoicevoxQuery {
  accent_phrases: AccentPhrase[];
  speedScale: number;
  pitchScale: number;
  intonationScale: number;
  volumeScale: number;
  prePhonemeLength: number;
  postPhonemeLength: number;
  outputSamplingRate: number;
  outputStereo: boolean;
  kana?: string;
}

export interface AccentPhrase {
  moras: Mora[];
  accent: number;
  pause_mora?: Mora;
  is_interrogative?: boolean;
}

export interface Mora {
  text: string;
  consonant?: string;
  consonant_length?: number;
  vowel: string;
  vowel_length: number;
  pitch: number;
}

export interface ToolMessage {
  [toolName: string]: string[];
}

export interface NotificationConfig {
  voicevoxUrl: string;
  speaker: number;
  defaultVolume: number;
  quietVolume: number;
  speedScale: number;
  tempDir: string;
  messages?: {
    tools?: ToolMessage;
    notification?: string[];
    stop?: string[];
  };
}

export type NotificationMode = 'tool' | 'notification' | 'stop';

export type ToolName = 
  | 'Task'
  | 'Bash'
  | 'Glob'
  | 'Grep'
  | 'LS'
  | 'Read'
  | 'Edit'
  | 'MultiEdit'
  | 'Write'
  | 'NotebookRead'
  | 'NotebookEdit'
  | 'WebFetch'
  | 'WebSearch'
  | 'TodoRead'
  | 'TodoWrite'
  | 'exit_plan_mode';