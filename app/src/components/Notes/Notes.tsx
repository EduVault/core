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
  Dispatch,
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
import { debounce } from 'lodash';
import {
  noteCreate,
  noteDelete,
  fetchNotes,
  noteUpdate,
} from '../../model/note';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClientReady,
  selectStartupSyncFinished,
  // selectRemoteReady,
  selectSyncing,
  setStartupSyncFinished,
  setSyncing,
} from '../../model/db';

export interface NotesState {
  notes: INote[];
  createNote: (noteText: string) => Promise<void>;
  updateNote: (note: INote) => Promise<boolean>;
  deleteNote: (note: INote) => Promise<void>;
  db?: EduvaultDB;
}

const initialState: NotesState = {
  notes: [],
  createNote: async (noteText: string) => undefined,
  updateNote: async (note: INote) => false,
  deleteNote: async (note: INote) => undefined,
  db: undefined,
};

export const NotesContext = createContext(initialState);

const appStartupSync = async (
  Note: NoteCollection,
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>,
  sync: EduVaultSync,
  dispatch: Dispatch<any>,
  push: (collectionNames: string[]) => Promise<{
    success: string[];
    backlog: string[];
  }>
) => {
  // if (mounted.current === null) return; // can solve unmounted error
  try {
    const {
      // result,
      error,
    } = await sync([noteKey]);
    if (error) throw error;
    const refreshedNotes = await fetchNotes(Note);
    setNotes(refreshedNotes);
    dispatch(setStartupSyncFinished(true));
    push([noteKey]);
  } catch (error) {
    console.log({ syncError: error });
  }
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
  const createNote = (noteText: string) => noteCreate(Note, noteText);
  const updateNote = (note: INote) => noteUpdate(Note, note);
  const deleteNote = (note: INote) => noteDelete(Note, note);

  // const remoteReady = useSelector(selectRemoteReady);
  const mounted = useRef(false); // prevents 'cannot perform a React state update on an unmounted component' error
  const clientReady = useSelector(selectClientReady); // if client is ready, remote is ready
  const startupSyncFinished = useSelector(selectStartupSyncFinished);

  // only allow push if startup sync is finished
  const debouncedPush = useRef(
    debounce(async () => {
      // console.log('debounced push not ready');
    }, 1)
  );

  if (startupSyncFinished) {
    // console.log('setting up push function');
    debouncedPush.current = debounce(async () => {
      // console.log('debounced push ready');
      push([noteKey]);
    }, 10000);
  }

  const refreshNotes = useCallback(async () => {
    const refreshedNotes = await fetchNotes(Note);
    setNotes(refreshedNotes);
    debouncedPush.current();
  }, [Note, debouncedPush]);

  useEffect(() => {
    if (mounted.current === null) return;
    // set initial notes
    refreshNotes();
  }, [refreshNotes]);

  useEffect(() => {
    if (mounted.current === null) return;
    // to be run one time on client ready
    if (clientReady) appStartupSync(Note, setNotes, sync, dispatch, push);
  }, [clientReady, Note, sync, dispatch, push]);

  useEffect(() => {
    if (mounted.current === null) return;
    const setupLocalListener = () => {
      // console.log('setup local listener');
      db.registerDexieListener(
        async (req, res, tableName) => {
          // console.log('dexie refresh listener', { req, res, tableName });
          refreshNotes();
        },
        [noteKey]
      );
    };
    setupLocalListener();
  }, [db, refreshNotes]);

  useEffect(() => {
    if (mounted.current === null) return;
    const setupSyncStatusListener = () => {
      db.onSyncingChange = () => {
        // console.log('syncing change', db.getIsSyncing());
        dispatch(setSyncing(db.getIsSyncing()));
      };
    };
    setupSyncStatusListener();
  }, [db, dispatch]);

  useEffect(() => {
    if (mounted.current === null) return;
    const setupClientListener = async () => {
      if (!db || !db.id) return;

      // check for client connection?
      // const threads = await db.client.listThreads();
      // console.log({ threads });
      // console.log('setting up client listener');
      const callback = async (update?: Update<INote>) => {
        if (!update || !update.instance) return;
        console.log('New remote update:', update);
        // Important: pass false here to prevent the _updatedAt from being updated by updateNote.
        const changed = await noteUpdate(Note, update.instance, false);
        console.log({ changed });
        if (changed) {
          const refreshedNotes = await fetchNotes(Note);
          setNotes(refreshedNotes);
          push([noteKey]);
        }
      };
      const filters = [{ collectionName: noteKey }];
      db.client.listen(ThreadID.fromString(db.id), filters, callback);
    };
    if (startupSyncFinished) setupClientListener();
  }, [db, startupSyncFinished, Note, push]);

  const state: NotesState = {
    notes,
    createNote,
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

  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'new' | 'edit'>('new');
  const [selectedNote, setSelectedNote] = useState('');

  const handleOpenEditor = (
    mode: 'new' | 'edit' = 'new',
    noteID: string = ''
  ) => {
    setEditorOpen(true);
    setEditorMode(mode);
    setSelectedNote(noteID);
  };
  const handleCloseEditor = () => setEditorOpen(false);

  return (
    <Box display="flex" flexDirection="column" textAlign="center">
      <Box margin="auto" alignItems="center" display="flex">
        <Box marginRight={4}>
          <Typography variant="h2">Notes</Typography>
        </Box>
        <Fab
          disabled={syncing}
          onClick={() => handleOpenEditor()}
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      </Box>

      {isEditorOpen && (
        <NoteEditor
          {...{
            isEditorOpen,
            handleClose: handleCloseEditor,
            mode: editorMode,
            noteID: selectedNote,
          }}
        ></NoteEditor>
      )}

      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {notes &&
          notes.length > 0 &&
          notes.map((note, i) => (
            <NoteCard
              key={i}
              {...{
                note,
                syncing,
                deleteNote,
                handleEditorOpen: handleOpenEditor,
              }}
            />
          ))}
      </Box>
    </Box>
  );
};

export interface NoteCardProps {
  note: INote;
  syncing: boolean;
  deleteNote: NotesState['deleteNote'];
  handleEditorOpen: (mode?: 'new' | 'edit', noteID?: string) => void;
}

export const NoteCard: FC<NoteCardProps> = ({
  note,
  syncing,
  handleEditorOpen,
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
            onClick={() => handleEditorOpen('edit', note._id)}
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
  isEditorOpen: boolean;
  handleClose: () => void;
  mode: 'edit' | 'new';
  noteID: INote['_id'];
}
export const NoteEditor = ({
  isEditorOpen,
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
      open={isEditorOpen}
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
