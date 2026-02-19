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


  const handleEditSetup = () => {
    console.log('Editing');
    setIsEditing(true);
    textAreaRef.current?.focus();
  };

  // 1. useDragAndDrop hook instance for moving notes 
  const moveDrag = useDragAndDrop({
    onDragStart: () => {
      onMoveToFront(note.id)
      // activate trash-zone
      onDrag(note.id, true)
    },

    onDragMove: (delta, currentPos) => {
      const newPos: Position = {
        x: Math.max(0, note.position.x + delta.x),
        y: Math.max(0, note.position.y + delta.y),
      };

      onUpdate(note.id, { position: newPos });
      onTrashZone(currentPos.y);
    },

    onDrop: () => {
      onDrag(note.id, false)
    }
  })

  // 2. instance of useDragAndDrop hook for resizing
  const resizeDrag = useDragAndDrop({
    onDragStart: () => {
      onMoveToFront(note.id)
    },

    onDragMove: (delta) => {
      const newSize = {
        width: Math.min(
          NOTE_MAX_SIZE.width,
          Math.max(NOTE_MIN_SIZE.width, note.size.width + delta.x),
        ),
        height: Math.min(
          NOTE_MAX_SIZE.height,
          Math.max(NOTE_MIN_SIZE.height, note.size.height + delta.y),
        ),
      };
      onUpdate(note.id, {size: newSize});
    }
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