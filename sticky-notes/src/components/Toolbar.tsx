/** Create a Toolbar with colours for sticky notes and an add button 
 * onAddNote passes colour to the Board parent
*/

import { useState } from "react";

const NOTE_COLOURS = {
  purple: { background: "#f3e5f5", header: "#e4a8db" },
  blue: { background: "#e3f2fd", header: "#9dcff8" },
  green: { background: "#e8f5e9", header: "#ade9af" },
  yellow: { background: "#fff9c4", header: "#f7ea84" },
  orange: { background: "#fff3e0", header: "#f7ce90" },
  red: { background: "#fce4ec", header: "#f48177" },
} as const satisfies Record<string, { background: string; header: string }>; // fixes circular reference between NOTE_COLOUR and NoteColour 

export type NoteColour = keyof typeof NOTE_COLOURS;

interface ToolbarProps {
    onAddNote: (colour: NoteColour) => void;
}

function Toolbar({onAddNote}: ToolbarProps) {
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
        <button onClick={()=> onAddNote(selectedColour)}>Add New Note</button>
    </>
  )
}

export default Toolbar