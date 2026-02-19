import type { Note } from "../types";

/* Api calls simulating a real backend: async functions with latency.
Using localStorage to store data so they persists reloads */

const LOCAL_STORAGE_KEY = "sticky-notes";
const DELAY_MS = 300;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function readStorage(): Note[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(notes: Note[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
}

// GET /notes call
export async function getAllNotes(): Promise<Note[]> {
  await delay(DELAY_MS);
  return readStorage();
}

// POST /notes call
export async function createNote(note: Note): Promise<Note> {
  await delay(DELAY_MS);
  writeStorage([...readStorage(), note]);
  return note;
}

// PATCH /notes/:id call
export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  await delay(DELAY_MS);
  const notes = readStorage();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) throw new Error(`Note "${id}" not found`);
  const updatedNote = { ...notes[index], ...updates };
  notes[index] = updatedNote;
  writeStorage(notes);
  return updatedNote;
}

// DELETE /notes/:id call
export async function deleteNote(id: string): Promise<void> {
  await delay(DELAY_MS);
  writeStorage(readStorage().filter((n) => n.id !== id));
}
