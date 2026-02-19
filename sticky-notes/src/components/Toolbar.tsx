/** Create a Toolbar with colours for sticky notes and an add button 
 * onAddNote passes colour to the Board parent
*/

import { useState } from "react";
import type { NoteColour } from "../types";
import { NOTE_COLOURS } from "../constants";
import styles from "./Toolbar.module.css";

interface ToolbarProps {
    onCreateNote: (colour: NoteColour) => void;
}

function Toolbar({onCreateNote}: ToolbarProps) {
const [selectedColour, setSelectedColour] = useState<NoteColour>("purple");
  return (
    <div className={styles.toolbar}>
        <div className={styles.colourPicker}>
            {(Object.keys(NOTE_COLOURS) as NoteColour[]).map((colour) => {
                return <button
                    key={colour}
                    aria-label={`Select ${colour} color`}
                    style={{background: NOTE_COLOURS[colour].header}}
                    className={`${styles.swatch}${colour === selectedColour ? ` ${styles.selected}` : ""}`}
                    onClick={() => setSelectedColour(colour)}
                />
            })}
        </div>
        <button 
        onClick={()=> onCreateNote(selectedColour)}
        className={styles.createButton}
        > 
          Add New Note
        </button>
    </div>
  )
}

export default Toolbar