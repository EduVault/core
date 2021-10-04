import { NoteCollection, INote } from '@eduvault/sdk-js/dist/main';
import { ulid } from 'ulid';

export const fetchNotes = async (Note: NoteCollection) => {
  const noteInstances = await Note.find({});
  const parsed: INote[] = [];
  await noteInstances.each((note) => {
    // console.log(note.toJSON());
    parsed.push(note.toJSON() as any);
  });
  // console.log({ parsed });
  return parsed;
};

export const createNote = async (
  Note: NoteCollection,
  noteText: string,
  callback?: (Note: NoteCollection) => unknown
) => {
  const note = {
    _id: ulid(),
    text: noteText,
    createdDate: new Date().getTime(),
    editedDate: new Date().getTime(),
  };
  // console.log({ note });
  await Note.create(note).save();
  if (callback) callback(Note);
};

export const deleteNote = async (
  Note: NoteCollection,
  noteId: string,
  callback?: (Note: NoteCollection) => unknown
) => {
  await Note.delete(noteId);
  if (callback) callback(Note);
};

export const updateNote = async (
  Note: NoteCollection,
  note: INote,
  callback?: (Note: NoteCollection) => unknown
) => {
  await Note.save(note);
  if (callback) callback(Note);
};
