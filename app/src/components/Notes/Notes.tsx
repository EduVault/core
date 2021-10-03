import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  ChangeEvent,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import AddIcon from '@material-ui/icons/Add';
import { NoteCollection, INote } from '@eduvault/sdk-js/';
import {
  createNote,
  deleteNote,
  fetchNotes,
  updateNote,
} from '../../model/note';

export interface NotesState {
  refreshNotes: () => Promise<void>;
  notes: INote[];
  saveNewNote: (noteText: string) => Promise<void>;
  removeNote: (noteID: string) => Promise<void>;
  editNote: (note: INote) => Promise<void>;
}

const initialState: NotesState = {
  refreshNotes: async () => undefined,
  notes: [],
  saveNewNote: async (noteText: string) => undefined,
  removeNote: async (noteID: string) => undefined,
  editNote: async (note: INote) => undefined,
};

export const NotesContext = createContext(initialState);

export const NotesProvider: FC<{ Note: NoteCollection }> = ({
  Note,
  children,
}) => {
  const [notes, setNotes] = useState<INote[]>([]);

  const refreshNotes = async () => {
    const refreshedNotes = await fetchNotes(Note);
    setNotes(refreshedNotes);
  };

  useEffect(() => {
    const refresh = async () => {
      const refreshedNotes = await fetchNotes(Note);
      setNotes(refreshedNotes);
    };

    refresh();
  }, [Note]);

  const saveNewNote = (noteText: string) =>
    createNote(Note, noteText, refreshNotes);

  const removeNote = (noteID: string) => deleteNote(Note, noteID, refreshNotes);

  const editNote = (note: INote) => updateNote(Note, note, refreshNotes);
  const state: NotesState = {
    notes,
    refreshNotes,
    saveNewNote,
    removeNote,
    editNote,
  };
  return (
    <NotesContext.Provider value={state}>{children}</NotesContext.Provider>
  );
};

export const Notes = ({ Note }: { Note: NoteCollection }) => (
  <NotesProvider Note={Note}>
    <NotesDashboard></NotesDashboard>
  </NotesProvider>
);

export const NotesDashboard = () => {
  const [editorOpen, setEditorOpen] = useState(false);

  const handleClickOpen = () => setEditorOpen(true);
  const handleClose = () => setEditorOpen(false);
  const { notes, removeNote } = useContext(NotesContext);

  const editorProps: EditorProps = { editorOpen, handleClose };
  return (
    <Box display="flex" flexDirection="column" textAlign="center">
      <Box margin="auto" alignItems="center" display="flex">
        <Box marginRight={4}>
          <Typography variant="h2">Notes</Typography>
        </Box>
        <Fab onClick={handleClickOpen} color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Box>

      {editorOpen && <NoteEditor {...editorProps}></NoteEditor>}

      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {notes &&
          notes.length > 0 &&
          notes.map((note) => (
            <Box key={note._id} margin={4} width={200}>
              <Card>
                <Box padding={4} width={200} minHeight={200}>
                  {note.text}
                </Box>
                <Button onClick={() => removeNote(note._id)}> DELETE</Button>
              </Card>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export interface EditorProps {
  editorOpen: boolean;
  handleClose: () => void;
}
export const NoteEditor = ({ editorOpen, handleClose }: EditorProps) => {
  const [noteText, setNoteText] = useState('');
  const {
    saveNewNote,
    // editNote
  } = useContext(NotesContext);
  const handleConfirm = () => {
    handleClose();
    saveNewNote(noteText);
    setNoteText('');
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNoteText(e.target.value);
  return (
    <Dialog
      open={editorOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <Box minWidth="500px">
        <DialogTitle id="form-dialog-title">New Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            maxRows={10}
            value={noteText}
            onChange={handleChange}
            id="note-text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
