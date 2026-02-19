import type {Size} from "./types"

export const TRASH_ZONE_HEIGHT = 80;

export const NOTE_MIN_SIZE: Size = { width: 150, height: 100 };
export const NOTE_DEFAULT_SIZE: Size = { width: 200, height: 160 };
export const NOTE_MAX_SIZE: Size = { width: 550, height: 450 };

export const NOTE_COLOURS = {
  purple: { background: "#f3e5f5", header: "#e4a8db" },
  blue: { background: "#e3f2fd", header: "#9dcff8" },
  green: { background: "#e8f5e9", header: "#ade9af" },
  yellow: { background: "#fff9c4", header: "#f7ea84" },
  orange: { background: "#fff3e0", header: "#f7ce90" },
  red: { background: "#fce4ec", header: "#f48177" },
} as const satisfies Record<string, { background: string; header: string }>; // fixes circular reference between NOTE_COLOUR and NoteColour 