import Toolbar from "./Toolbar"
import TrashZone from "./TrashZone"
import type { NoteColour, Position, Note } from "../types"
import { useState } from "react";
import { NOTE_DEFAULT_SIZE, TRASH_ZONE_HEIGHT } from "../constants";
import StickyNote from "./StickyNote";

// Generate Note Id
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function Board() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteId, setNoteId] = useState<string | null>("5") //(null);
  const [isOverTrash, setIsOverTrash] = useState(false);

  const addNote = (position: Position, colour: NoteColour) => {
    setNotes((prev) => [
      ...prev,
      { id: generateId(), position, size: NOTE_DEFAULT_SIZE, text: "", colour},
    ]);
  };

   const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

    const handleTrashZone = () => {};
    const handleDrag = () => {};



  /* Calculates a random position within the visible board area 
   (avoiding the toolbar and trash) */
  const handleCreateNote = (colour: NoteColour) => {
    const { width, height } = NOTE_DEFAULT_SIZE;
    // Subtract note size + padding so notes don't spawn off-screen
    const maxX = Math.max(0, window.innerWidth - width - 40);
    const maxY = Math.max(0, window.innerHeight - height - TRASH_ZONE_HEIGHT - 100);
    const position: Position = {
      x: 40 + Math.random() * maxX,
      y: 100 + Math.random() * maxY,
    };
    addNote(position, colour);
  } 

  return (
    <>
    <Toolbar onCreateNote={handleCreateNote} />
    {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onDrag={handleDrag}
          onTrashZone={handleTrashZone}
        />
      ))}
    <TrashZone isVisible={noteId !== null} isOverTrashZone={isOverTrash} />
    </>

  )
}

export default Board