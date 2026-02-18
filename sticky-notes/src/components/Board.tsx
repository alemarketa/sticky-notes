import Toolbar from "./Toolbar"
import type { NoteColour } from "./Toolbar"

function Board() {

  const handleAddNote = (colour: NoteColour) => {
    console.log('Selected colour:', colour )
  } 

  return (
    <Toolbar onAddNote={handleAddNote} />
  )
}

export default Board