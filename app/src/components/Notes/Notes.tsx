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
  createNote,
  deleteNote,
  fetchNotes,
  updateNote,
} from '../../model/note';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClientReady,
  selectRemoteReady,
  selectSyncing,
  setSyncing,
} from '../../model/db';

export interface NotesState {
  refreshNotes: () => Promise<void>;
  notes: INote[];
  saveNewNote: (noteText: string) => Promise<void>;
  removeNote: (noteID: string) => Promise<void>;
  editNote: (note: INote) => Promise<void>;
  db?: EduvaultDB;
}

const initialState: NotesState = {
  refreshNotes: async () => undefined,
  notes: [],
  saveNewNote: async (noteText: string) => undefined,
  removeNote: async (noteID: string) => undefined,
  editNote: async (note: INote) => undefined,
  db: undefined,
};

export const NotesContext = createContext(initialState);

export type DBCoreMutateResponse = {
  numFailures: number;
  failures: {
    [operationNumber: number]: Error;
  };
  lastResult: any;
  results?: any[] | undefined;
};

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

  const refreshNotes = useCallback(async () => {
    const refreshedNotes = await fetchNotes(Note);
    setNotes(refreshedNotes);
    push([noteKey]);
  }, [Note, push]);

  db.onSyncingChange = () => {
    dispatch(setSyncing(db.getIsSyncing()));
  };
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

  const saveNewNote = (noteText: string) => createNote(Note, noteText);
  const removeNote = (noteID: string) => deleteNote(Note, noteID);
  const editNote = (note: INote) => updateNote(Note, note);

  const state: NotesState = {
    notes,
    refreshNotes,
    saveNewNote,
    removeNote,
    editNote,
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
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'new' | 'edit'>('new');
  const [selectedNote, setSelectedNote] = useState('');

  const handleClickOpen = (
    mode: 'new' | 'edit' = 'new',
    noteID: string = ''
  ) => {
    setEditorMode(mode);
    setSelectedNote(noteID);
    setEditorOpen(true);
  };
  const syncing = useSelector(selectSyncing);
  const handleClose = () => setEditorOpen(false);
  const { notes, removeNote } = useContext(NotesContext);

  const editorProps: EditorProps = {
    editorOpen,
    handleClose,
    mode: editorMode,
    noteID: selectedNote,
  };
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

      {editorOpen && <NoteEditor {...editorProps}></NoteEditor>}
      <Typography variant="h2">
        {syncing ? 'syncing' : ' not syncing'}
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {notes &&
          notes.length > 0 &&
          notes.map((note) => (
            <Box key={note._id} margin={4} width={200}>
              <Card>
                <Box padding={4} width={200} minHeight={200}>
                  {note.text}
                </Box>
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  padding={1}
                >
                  <Button
                    disabled={syncing}
                    onClick={() => handleClickOpen('edit', note._id)}
                  >
                    EDIT
                  </Button>
                  <Button
                    disabled={syncing}
                    onClick={() => removeNote(note._id)}
                  >
                    {' '}
                    DELETE
                  </Button>
                </Box>
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
  mode: 'edit' | 'new';
  noteID: INote['_id'];
}
export const NoteEditor = ({
  editorOpen,
  handleClose,
  mode,
  noteID,
}: EditorProps) => {
  const [noteText, setNoteText] = useState('');
  const [note, setNote] = useState<INote>();
  const { saveNewNote, editNote, notes } = useContext(NotesContext);
  const selectedNote: INote | undefined = notes.find(
    (note) => note._id === noteID
  );
  useEffect(() => {
    if (selectedNote) {
      setNote(selectedNote);
      setNoteText(selectedNote.text);
    }
  }, [selectedNote]);
  const editMode = mode === 'edit';

  const handleEditConfirm = () => {
    if (!note) return;
    editNote(note);
  };

  const handleConfirm = () => {
    if (!editMode) saveNewNote(noteText);
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
