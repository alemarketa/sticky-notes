import type { Note, Position } from "../types";
import {NOTE_COLOURS, NOTE_MAX_SIZE, NOTE_MIN_SIZE} from '../constants';
import { useState } from "react";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { GripHorizontal } from "lucide-react";


interface NoteProps {
  note: Note,
  onUpdate: (noteId: string, editedProps: Partial<Note>) => void;
  onDrag: (noteId: string, isDragging: boolean) => void;
  onTrashZone: (cursor: number) => void
}


function StickyNote({note,
  onUpdate,
  onDrag,
  onTrashZone} : NoteProps) {

  const colours = NOTE_COLOURS[note.colour];
  const [isEditing, setIsEditing] = useState(false);


  const handleEditSetup = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    setIsEditing(true);
    e.currentTarget.focus();
  };

  // 1. useDragAndDrop hook instance for moving notes 
  const moveDrag = useDragAndDrop({
    onDragStart: () => {
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
    <div  style={{ position: 'absolute', left: note.position.x,
 top: note.position.y,
 width: note.size.width,
 height: note.size.height }}>
      <div style={{background: colours.header}}  onMouseDown={moveDrag.startDrag}>
        Note Header
        <GripHorizontal size={16} color="rgba(0,0,0,0.3)" />
      </div>
      <div style={{background: colours.background}}>
         <textarea
          value={note.text}
          onChange={(e) => onUpdate(note.id, { text: e.target.value })}
          onClick={handleEditSetup}
          onBlur={() => setIsEditing(false)}
          readOnly={!isEditing}
          placeholder="Click here to edit..."
        />

         <div onMouseDown={resizeDrag.startDrag}>
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