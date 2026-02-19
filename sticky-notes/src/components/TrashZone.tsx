
import {Trash} from "lucide-react";

interface TrashZoneProps {
  isVisible: boolean; // if we are dragging a note = true
  isOverTrashZone: boolean; // if a note is over TZ = true
}

const TRASH_ZONE_HEIGHT = 100;

function TrashZone({isVisible, isOverTrashZone}: TrashZoneProps) {
  return (
    <div style={{background: 'red',  height: TRASH_ZONE_HEIGHT}}>TrashZone
      <Trash
        size={28}
        color={isOverTrashZone ? "red" : "grey"}
      />

      <p>{isOverTrashZone ? "Release to delete" : "Drop here to delete" }</p>
    </div>
  )
}

export default TrashZone