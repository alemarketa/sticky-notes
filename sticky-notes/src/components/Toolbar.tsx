/** Create a Toolbar with colours for sticky notes and an add button 
 * onAddNote passes colour to the Board parent
*/

import { useState } from "react";
import type { NoteColour } from "../types";
import { NOTE_COLOURS } from "../constants";

interface ToolbarProps {
    onCreateNote: (colour: NoteColour) => void;
}

function Toolbar({onCreateNote}: ToolbarProps) {
const [selectedColour, setSelectedColour] = useState<NoteColour>("purple");
  return (
    <>
        <div>
            {(Object.keys(NOTE_COLOURS) as NoteColour[]).map((colour) => {
                return <button
                    key={colour}
                    aria-label={`Select ${colour} color`}
                    style={{background: NOTE_COLOURS[colour].header}}
                    onClick={() => setSelectedColour(colour)}
                />
            })}
        </div>
        <button onClick={()=> onCreateNote(selectedColour)}>Add New Note</button>
    </>
  )
}

export default Toolbar