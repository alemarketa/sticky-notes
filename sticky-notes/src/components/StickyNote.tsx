import type { Note } from "../types";
import {NOTE_COLOURS} from '../constants';
import { useState } from "react";


interface NoteProps {
  note: Note,
  onUpdate: (noteId: string, editedProps: Partial<Note>) => void;
  onDrag: (noteId: string) => void;
  onTrashZone: (noteId: string, cursor: number) => void
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
  
  return (
    <div>
      <div style={{background: colours.header}}>Note Header</div>
      <div style={{background: colours.background}}>
         <textarea
          value={note.text}
          onChange={(e) => onUpdate(note.id, { text: e.target.value })}
          onClick={handleEditSetup}
          onBlur={() => setIsEditing(false)}
          readOnly={!isEditing}
          placeholder="Click here to edit..."
        />
        </div>
    </div>
  )
}

export default StickyNote