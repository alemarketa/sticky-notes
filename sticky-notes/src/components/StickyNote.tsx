import type { Note, Position } from "../types";
import {NOTE_COLOURS, NOTE_MAX_SIZE, NOTE_MIN_SIZE} from '../constants';
import { useState, useRef } from "react";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { GripHorizontal } from "lucide-react";
import styles from './StickyNote.module.css';


interface NoteProps {
  note: Note,
  onUpdate: (noteId: string, editedProps: Partial<Note>) => void;
  onDrag: (noteId: string, isDragging: boolean) => void;
  onTrashZone: (cursor: number) => void
  onMoveToFront: (noteId: string) => void;
}


function StickyNote({note,
  onUpdate,
  onDrag,
  onTrashZone,
  onMoveToFront} : NoteProps) {

  const colours = NOTE_COLOURS[note.colour];
  const [isEditing, setIsEditing] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  /* Tracks the note's position during an active drag/resize outside of React state,                                           
   so each mousemove frame always has the latest position — not a stale render = no sluggish note movement*/                                       
  const dragPositionRef = useRef<Position | null>(null); 
   /* Bounds are snapshotted at drag start rather than read from the closure on                             
    each move, so they don't depend on React re-render*/ 
  const dragResizeRef = useRef<{ width: number; height: number } | null>(null);
  const dragBoundsRef = useRef<{ maxX: number; maxY: number } | null>(null);


  const handleEditSetup = () => {
    setIsEditing(true);
    textAreaRef.current?.focus();
  };

  // 1. useDragAndDrop hook instance for moving notes 
  const moveDrag = useDragAndDrop({
    onDragStart: () => {
      //snapshot the current position
      dragPositionRef.current = note.position
      dragBoundsRef.current = {
        maxX: window.innerWidth - note.size.width,
        maxY: window.innerHeight - note.size.height,
      };
      onMoveToFront(note.id)
      // activate trash-zone
      onDrag(note.id, true)
    },

    onDragMove: (delta, currentPos) => {
      if (!dragPositionRef.current || !dragBoundsRef.current)  return;
      const { maxX, maxY } = dragBoundsRef.current;
      const newPos: Position = {
        x: Math.min(maxX, Math.max(0, dragPositionRef.current.x + delta.x)),
        y: Math.min(maxY, Math.max(0, dragPositionRef.current.y + delta.y)),
      };
      dragPositionRef.current = newPos;
      onUpdate(note.id, { position: newPos });
      onTrashZone(currentPos.y);
    },

    onDrop: () => {
      dragPositionRef.current = null;
      dragBoundsRef.current = null;
      onDrag(note.id, false)
    }
  })

  // 2. instance of useDragAndDrop hook for resizing
  const resizeDrag = useDragAndDrop({
    onDragStart: () => {
      dragResizeRef.current = note.size;
      onMoveToFront(note.id)
    },

    onDragMove: (delta) => {
      if (!dragResizeRef.current) return;
      const newSize = {
        width: Math.min(
          NOTE_MAX_SIZE.width,
          Math.max(NOTE_MIN_SIZE.width, dragResizeRef.current.width + delta.x),
        ),
        height: Math.min(
          NOTE_MAX_SIZE.height,
          Math.max(NOTE_MIN_SIZE.height, dragResizeRef.current.height + delta.y),
        ),
      };
      dragResizeRef.current = newSize;
      onUpdate(note.id, {size: newSize});
    },

    onDrop: () => {
      dragResizeRef.current = null;
    },
  })
  
  return (
    // Inline styles per unique note
    <div className={styles.note}
     style={{ 
      left: note.position.x,
      top: note.position.y,
      width: note.size.width,
      height: note.size.height,
      zIndex: note.zIndex }}
    >
      <div className={styles.header} 
        style={{background: colours.header}} 
        onMouseDown={moveDrag.startDrag}>
        <GripHorizontal size={16} color="rgba(0,0,0,0.3)" />
      </div>

      <div className={styles.body}
        style={{background: colours.background}}
        onClick={handleEditSetup}
      >
        <textarea
          ref={textAreaRef}
          value={note.text}
          onChange={(e) => onUpdate(note.id, { text: e.target.value })}
          onBlur={() => setIsEditing(false)}
          readOnly={!isEditing}
          placeholder="Click here to edit..."
          className={`${styles.textarea} ${!isEditing ? styles.readonly : ""}`}
        />

        <div onMouseDown={resizeDrag.startDrag} className={styles.resizeIcon}>
        <GripHorizontal
          size={14}
          color="rgba(0,0,0,0.25)"
          style={{ transform: "rotate(45deg)" }}
        />
        </div>
        </div>
    </div>
  )
}

export default StickyNote