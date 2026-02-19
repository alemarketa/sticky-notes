import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toolbar  from '../components/Toolbar';
import TrashZone from '../components/TrashZone';

// --- Toolbar ---
describe('Toolbar', () => {
  it('calls onCreateNote with the selected color when Add New Note button is clicked', async () => {
    const onCreateNote = vi.fn();
    render(<Toolbar onCreateNote={onCreateNote} />);

    await userEvent.click(screen.getByRole('button', { name: /add new note/i }));

    // Default selected color is "purple"
    expect(onCreateNote).toHaveBeenCalledOnce();
    expect(onCreateNote).toHaveBeenCalledWith('purple');
  });
});

// --- TrashZone ---
describe('TrashZone', () => {
  it('shows delete instructions when a note is being dragged over it', () => {
    render(<TrashZone isVisible={true} isOverTrashZone={true} />);
    expect(screen.getByText('Release to delete')).toBeInTheDocument();
  });
});
