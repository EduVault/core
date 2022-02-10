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
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AddIcon from '@material-ui/icons/Add';
import {
  NoteCollection,
  INote,
  EduVaultSync,
  EduVaultPush,
  noteKey,
  EduvaultDB,
  Update,
  ThreadID,
} from '@eduvault/sdk-js';
import {
  noteCreate,
  noteDelete,
  fetchNotes,
  noteUpdate,
} from '../../model/note';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClientReady,
  selectRemoteReady,
  selectSyncing,
  setSyncing,
} from '../../model/db';

export interface NotesState {
  notes: INote[];
  createNote: (noteText: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
  updateNote: (note: INote) => Promise<void>;
  deleteNote: (note: INote) => Promise<void>;
  db?: EduvaultDB;
}

const initialState: NotesState = {
  notes: [],
  createNote: async (noteText: string) => undefined,
  refreshNotes: async () => undefined,
  updateNote: async (note: INote) => undefined,
  deleteNote: async (note: INote) => undefined,
  db: undefined,
};

export const NotesContext = createContext(initialState);

export const NotesProvider: FC<NotesProps> = ({
  Note,
  children,
  push,
  sync,
  db,
}) => {
  const dispatch = useDispatch();

  const [notes, setNotes] = useState<INote[]>([]);

  const remoteReady = useSelector(selectRemoteReady);
  const clientReady = useSelector(selectClientReady);

  const mounted = useRef(false);
  useEffect(() => {
    // to be run one time on remote ready
    const appStartupSync = async () => {
      if (mounted.current === null) return; //can solve unmounted error
      try {
        const {
          // result,
          error,
        } = await sync([noteKey]);
        if (error) throw error;
        const refreshedNotes = await fetchNotes(Note);
        await setNotes(refreshedNotes);
        push([noteKey]);
      } catch (error) {
        console.log({ syncError: error });
      }
    };

    if (remoteReady) appStartupSync();
  }, [sync, push, Note, remoteReady, db]);
  db.onSyncingChange = () => {
    dispatch(setSyncing(db.getIsSyncing()));
  };

  const refreshNotes = useCallback(async () => {
    const refreshedNotes = await fetchNotes(Note);
    setNotes(refreshedNotes);
    push([noteKey]);
  }, [Note, push]);
  db.registerLocalListener(async (req, res, tableName) => {
    refreshNotes();
  });

  // to be run on startup
  useEffect(() => {
    refreshNotes();
  }, [Note, dispatch, db, refreshNotes]);

  useEffect(() => {
    const setupListener = async () => {
      if (clientReady && db.id) {
        const threads = await db.client.listThreads();
        console.log({ threads });
        console.log('setting up client listener');
        const callback = (update?: Update<INote>) => {
          if (!update || !update.instance) return;
          console.log('New update:', update);
        };
        // const filters = [{ collectionName: 'note' }];
        db.client.listen(ThreadID.fromString(db.id), [], callback);
      }
    };
    setupListener();
  }, [clientReady, db]);

  const createNote = (noteText: string) => noteCreate(Note, noteText);
  const updateNote = (note: INote) => noteUpdate(Note, note);
  const deleteNote = (note: INote) => noteDelete(Note, note);

  const state: NotesState = {
    notes,
    createNote,
    refreshNotes,
    updateNote,
    deleteNote,
    db,
  };
  return (
    <NotesContext.Provider value={state}>{children}</NotesContext.Provider>
  );
};

export interface NotesProps {
  sync: EduVaultSync;
  push: EduVaultPush;
  Note: NoteCollection;
  db: EduvaultDB;
}

export const Notes = (props: NotesProps) => (
  <NotesProvider {...props}>
    <NotesDashboard></NotesDashboard>
  </NotesProvider>
);

export const NotesDashboard = () => {
  const syncing = useSelector(selectSyncing);
  const { notes, deleteNote } = useContext(NotesContext);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'new' | 'edit'>('new');
  const [selectedNote, setSelectedNote] = useState('');

  const handleClickOpen = (
    mode: 'new' | 'edit' = 'new',
    noteID: string = ''
  ) => {
    setEditorOpen(true);
    setEditorMode(mode);
    setSelectedNote(noteID);
  };
  const handleClose = () => setEditorOpen(false);

  return (
    <Box display="flex" flexDirection="column" textAlign="center">
      <Box margin="auto" alignItems="center" display="flex">
        <Box marginRight={4}>
          <Typography variant="h2">Notes</Typography>
        </Box>
        <Fab
          disabled={syncing}
          onClick={() => handleClickOpen()}
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      </Box>

      {editorOpen && (
        <NoteEditor
          {...{
            editorOpen,
            handleClose,
            mode: editorMode,
            noteID: selectedNote,
          }}
        ></NoteEditor>
      )}

      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {notes &&
          notes.length > 0 &&
          notes.map((note) => (
            <NoteCard {...{ note, syncing, deleteNote, handleClickOpen }} />
          ))}
      </Box>
    </Box>
  );
};

export interface NoteCardProps {
  note: INote;
  syncing: boolean;
  deleteNote: NotesState['deleteNote'];
  handleClickOpen: (mode?: 'new' | 'edit', noteID?: string) => void;
}

export const NoteCard: FC<NoteCardProps> = ({
  note,
  syncing,
  handleClickOpen,
  deleteNote,
}) => {
  return (
    <Box key={note._id} margin={4} width={200}>
      <Card>
        <Box padding={4} width={200} minHeight={200}>
          {note.text}
        </Box>
        <Box display="flex" justifyContent="space-between" padding={1}>
          <Button
            disabled={syncing}
            onClick={() => handleClickOpen('edit', note._id)}
          >
            EDIT
          </Button>
          <Button disabled={syncing} onClick={() => deleteNote(note)}>
            DELETE
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
export interface EditorProps {
  editorOpen: boolean;
  handleClose: () => void;
  mode: 'edit' | 'new';
  noteID: INote['_id'];
}
export const NoteEditor = ({
  editorOpen,
  handleClose,
  mode,
  noteID,
}: EditorProps) => {
  const { createNote, updateNote, notes } = useContext(NotesContext);

  const [note, setNote] = useState<INote>();
  const [noteText, setNoteText] = useState('');

  const selectedNote: INote | undefined = notes.find(
    (note) => note._id === noteID
  );

  useEffect(() => {
    if (selectedNote) {
      setNote(selectedNote);
      setNoteText(selectedNote.text);
    }
  }, [selectedNote]);

  const handleEditConfirm = () => {
    if (!note) return;
    updateNote(note);
  };

  const editMode = mode === 'edit';

  const handleConfirm = () => {
    if (!editMode) createNote(noteText);
    else if (editMode) handleEditConfirm();
    setNoteText('');
    handleClose();
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNoteText(e.target.value);
    if (note) setNote({ ...note, text: noteText });
  };

  return (
    <Dialog
      open={editorOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <Box minWidth="500px">
        <DialogTitle id="form-dialog-title">
          {editMode ? 'Edit Note' : 'New Note'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            maxRows={10}
            value={noteText}
            onChange={handleTextChange}
            id="note-text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
