export enum StringName {
  G = 'G',
  D = 'D',
  A = 'A',
  E = 'E'
}

export interface NoteData {
  time: number;       // Start time in seconds
  duration: number;   // Duration in seconds
  stringIndex: 0 | 1 | 2 | 3; // 0=G, 1=D, 2=A, 3=E
  fingerPosition: number; // 0=Open, 1=1st finger, etc. (Approx distance from nut)
  noteName: string;   // e.g., "C#4"
  frequency: number;  // Hz
}

export interface Song {
  id: string;
  title: string;
  subtitle?: string;
  composer: string;
  coverUrl: string;
  difficulty: number; // 1-5
  views: number;
  likes: number;
  tags: string[];
  notes: NoteData[]; // Mock MIDI data
}

export enum ViewState {
  HOME = 'HOME',
  DETAIL = 'DETAIL',
  PLAYER = 'PLAYER'
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
  showFingerboard: boolean;
  showFallingNotes: boolean;
  volume: number;
}
