
import {Trash} from "lucide-react";
import { TRASH_ZONE_HEIGHT } from "../constants";
import styles from './TrashZone.module.css';

interface TrashZoneProps {
  isVisible: boolean; // if we are dragging a note = true
  isOverTrashZone: boolean; // if a note is over TZ = true
}

function TrashZone({isVisible, isOverTrashZone}: TrashZoneProps) {
   const computedStyles = [
    styles.trashZone,
    isVisible ? styles.active : "",
    isOverTrashZone ? styles.hovering : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={computedStyles} style={{height: TRASH_ZONE_HEIGHT}}>
      {isVisible && (
        <>
          <Trash
          size={28}
          color={isOverTrashZone ? "red" : "grey"}
        />

        <span className={styles.label}>
          {isOverTrashZone ? "Release to delete" : "Drop here to delete" }
        </span>
        </>
    )}
    </div>
  );
}

export default TrashZone