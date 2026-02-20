# Sticky Notes

It is a drag-and-drop sticky notes board built with React 19 and TypeScript. Notes are freely positioned on a canvas, resizable, colour-coded, and persist across page reloads via localStorage.

## Features

- Create notes in 6 colours (purple, blue, green, yellow, orange, red)
- Drag notes across the board; notes are clamped to the viewport so they cannot be lost off-screen
- Resize notes by dragging the bottom-right corner handle
- Click anywhere on a note body to enter edit mode; click outside to exit
- Drag a note into the trash zone at the bottom of the screen to delete it
- Active note is automatically brought to the front (z-index management)
- All notes persist across browser reloads via localStorage

## Tech Stack

React, Vite, Vitest, React Testing Library, Lucide React

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── api/
│   └── notesApi.ts          # Simulated async API layer (localStorage-backed)
├── components/
│   ├── Board.tsx             # Root canvas — owns all note state
│   ├── Board.module.css
│   ├── StickyNote.tsx        # Individual note (drag, resize, edit)
│   ├── StickyNote.module.css
│   ├── Toolbar.tsx           # Colour picker + create button
│   ├── Toolbar.module.css
│   ├── TrashZone.tsx         # Drop target for deletion
│   └── TrashZone.module.css
├── hooks/
│   └── useDragAndDrop.tsx    # Reusable mouse drag
├── test/
│   ├── setup.ts
│   └── components.test.tsx
├── constants.tsx             # Sizes, colours, localStorage key
└── types.tsx                 # Shared TypeScript interfaces
```

## Architecture

### State ownership and data flow

All note data — position, size, text, colour, z-index — lives in a single `useState` array inside `Board`. Child components own only local UI state that does not need to be shared: `Toolbar` tracks selected colour, and `StickyNote` tracks whether it is in edit mode. There is a `useEffect` that mirrors crud operations on notes to localStorage on every update.
Everything that crosses component boundaries travels through props and callbacks.

The main alternative would have been to give each `StickyNote` its own local state for position, size, and text. On one hand, it avoids prop drilling, but it creates a coordination problem: some features like z-index ordering, trash-zone detection, or persistence require knowledge of every note at once - and if state is scattered among components, you would have to reach to each and every individual StickyNote, there's would not be a single place to read from or write to.
Lifting state to `Board` solves this cleanly without introducing a global state library (MobX, Redux). For an application of this scope, a context or external store would add complexity without meaningful benefit.

### Custom drag hook

Mouse-based drag-and-drop is handled by `useDragAndDrop`, a reusable hook that attaches `mousemove` and `mouseup` listeners to  `document` (to not leave the element's bounds) on drag start and removes them on drop. It is used once for moving, and once for resizing — with different callbacks. Callbacks are stored in a `useRef (callbacksRef)` so its `.current` always points to the latest version of the function - fresh state, no stale closure.Note positions during a drag are also tracked in a `ref (dragPosRef)` rather than state, so each frame accumulates delta (=how far the mouse moved since the last event) from the previous position without waiting for a React render cycle. 

### Styling approach

Component styles are colocated using CSS Modules, which provides compile-time class name scoping with zero runtime overhead, unlike CSS-in-JS solutions (styled-components, Emotion) that inject styles dynamically and add bundle weight. Per-note dynamic values (position, size, z-index, colour) that cannot be expressed as static class names are applied as inline styles - a standard React pattern for runtime-variable properties.

---

## API Layer

`src/api/notesApi.ts` contains async functions (`getAllNotes`, `createNote`, `updateNote`, `deleteNote`) that simulate a REST backend with an artificial delay and localStorage as the backing store.

**Current status:** Due to time constraints, the API integration was only partially completed. `Board.tsx` currently manages persistence for creates and updates directly via a `useEffect` that writes the full notes array to localStorage on every state change. Only `deleteNote` is called from `Board`, which creates a known redundancy: when a note is deleted, the `useEffect` writes the filtered state to localStorage first, and then `deleteNote` reads that same key after its 300 ms delay, filters the already-absent note, and writes back. This double-write is harmless — by the time `deleteNote` reads, localStorage already reflects the correct state — but it is not the intended design. The goal is to complete the integration so all mutations go only through the API layer and the `useEffect` sync is removed. The `notesApi.ts` file has been kept in its current form to reflect that intended architecture.

---

## Performance: Known Issues and Suggested Improvements

The current implementation is for typical usage (tens of notes). At larger scale the following optimisations are worth considering:

**1. Memoize `StickyNote` with `React.memo`**
Every state change in `Board` — including a position update on a single dragged note — causes all sibling notes to re-render, because they receive new function-reference props on each render. Wrapping `StickyNote` in `React.memo` and stabilising callbacks with `useCallback` would limit re-renders to notes whose props actually changed. 
However,`React.memo` itself has a cost (the shallow comparison on every render), and many `useCallback` add noise to the code. For a small number of notes, the code perform well even without it. But I am open to discuss this :-)

**2. Debounce text updates**
Every keystroke in a note's textarea triggers a state update, which triggers the `useEffect`, which calls `localStorage.setItem`. Debouncing the `onChange` handler would reduce localStorage writes with no visible lag to the user.

**3. Write only the changed note to localStorage**
The current `useEffect`(as well as `notesApi`) serialises and writes the entire notes array on every change. Switching to store each note under its individual key in `localStorage` would mean writes to affected note's data rather than re-serialising every note on the board.
