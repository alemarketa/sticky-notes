import { NOTE_COLOURS } from "./constants";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type NoteColour = keyof typeof NOTE_COLOURS;

export interface Note {
  id: string;
  position: Position;
  size: Size;
  text: string;
  colour: NoteColour;
}