import { useCallback, useEffect, useRef } from "react";
import type { Position } from "../types";

interface DragAndDropCallbacks {
  onDragStart?: (startPos: Position) => void;
  // delta = how many pixels the mouse moved since last frame
  onDragMove: (delta: Position, currentPos: Position) => void;
  onDrop?: (currentPos: Position) => void;
}

export function useDragAndDrop(callbacks: DragAndDropCallbacks) {
  const startPos = useRef<Position>({ x: 0, y: 0 });
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;
  const cleanupRef = useRef<(() => void) | null>(null);

  // cleanup
  useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startPos.current = { x: e.clientX, y: e.clientY };
    callbacksRef.current.onDragStart?.({ x: e.clientX, y: e.clientY });

    const handleMove = (ev: MouseEvent) => {
      const delta: Position = {
        x: ev.clientX - startPos.current.x,
        y: ev.clientY - startPos.current.y,
      };
      startPos.current = { x: ev.clientX, y: ev.clientY };
      callbacksRef.current.onDragMove(delta, { x: ev.clientX, y: ev.clientY });
    };

    const handleUp = (ev: MouseEvent) => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      cleanupRef.current = null;
      callbacksRef.current.onDrop?.({ x: ev.clientX, y: ev.clientY });
    };

    cleanupRef.current = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }, []);

  return { startDrag };
}
