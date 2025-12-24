export interface WordSplit {
  left: string;
  pivot: string;
  right: string;
}

export enum ReaderMode {
  INPUT = 'INPUT',
  READING = 'READING',
}

export enum InputType {
  PASTE = 'PASTE',
  FILE = 'FILE',
}

export interface ReaderSettings {
  wpm: number;
  chunkSize: number; // For future support of multi-word RSVP
}