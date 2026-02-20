import Toolbar from "./Toolbar"
import TrashZone from "./TrashZone"
import type { NoteColour, Position, Note } from "../types"
import { useState, useEffect, useRef } from "react";
import { NOTE_DEFAULT_SIZE, TRASH_ZONE_HEIGHT } from "../constants";
import StickyNote from "./StickyNote";
import styles from "./Board.module.css";
import { deleteNote } from "../api/notesApi";

// Generate Note Id
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// z-index for moving notes to front
let nextZIndex = 1;

const LOCAL_STORAGE_KEY = "sticky-notes";

function Board() {  
  /* Ref mirrors isOverTrash so handleDrag always reads the latest value even if
   mouseup fires before React has processed the setIsOverTrash state update.
   This fixes stale closer isOverTrash = false even if the note is already over TZ*/
  const isOverTrashZoneRef = useRef(false);
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  // Lazy initializer function — runs once on mount. Reads saved notes from localStorage
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes) as Note[];
        // restores nextZIndex so new notes always render above existing one
        nextZIndex = Math.max(...parsed.map((n) => n.zIndex), 0) + 1;
        return parsed;
      }
    } catch(error) {
      console.error("Failed to load notes from localStorage:", error);
      
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

    // Clamp all note positions when the window is resized so notes never go off-screen
  useEffect(() => {
    const handleResize = () => {
      setNotes((prev) => prev.map((note) => ({
        ...note,
        position: {
          x: Math.min(note.position.x, Math.max(0, window.innerWidth - note.size.width)),
          y: Math.min(note.position.y, Math.max(0, window.innerHeight - note.size.height)),
        },
      })));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addNote = (position: Position, colour: NoteColour) => {
    const noteToUpdate: Note = {
      id: generateId(),
      position,
      size: NOTE_DEFAULT_SIZE,
      text: "",
      colour,
      zIndex: nextZIndex++,
    };
    setNotes((prev) => [
      ...prev, noteToUpdate
    ]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    deleteNote(id).catch((error) => console.error("Note deletion failed:", error));

  };

  const moveToFront = (id: string) => {
    const frontIndex = nextZIndex++;
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, zIndex: frontIndex } : n)));
  };


  // check whether the cursor Y position is inside the trash zone
  const handleTrashZone = (cursorY: number) => {
    const overZone = cursorY > window.innerHeight - TRASH_ZONE_HEIGHT;
    if (overZone !== isOverTrashZoneRef.current) {
      isOverTrashZoneRef.current = overZone;
      setIsOverTrash(overZone);
    }
  };
  const handleDrag = (noteId: string, isDragging: boolean) => {
    if(isDragging){
      setDraggedNoteId(noteId)
    }
    else{
      if(isOverTrashZoneRef.current) {
        removeNote(noteId)
      }
      setDraggedNoteId(null);
      isOverTrashZoneRef.current = false;
      setIsOverTrash(false);
    }
  };


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
    <div className={styles.board}>
      <Toolbar onCreateNote={handleCreateNote} />
      {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDrag={handleDrag}
            onTrashZone={handleTrashZone}
            onMoveToFront={moveToFront}
          />
        ))}
      <TrashZone isVisible={draggedNoteId !== null} isOverTrashZone={isOverTrash} />
    </div>

  )
}

export default Board