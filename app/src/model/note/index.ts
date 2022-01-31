import { NoteCollection, INote } from '@eduvault/sdk-js';
import { ulid } from 'ulid';

export const fetchNotes = async (Note: NoteCollection) => {
  const noteInstances = await Note.find({});
  const parsed: INote[] = [];
  if (noteInstances && Object.keys(noteInstances).length > 0)
    await noteInstances.each((note) => {
      // console.log('note to json', note.toJSON());
      parsed.push(note.toJSON() as any);
    });
  // console.log({ parsed });
  return parsed;
};

export const createNote = async (Note: NoteCollection, noteText: string) => {
  const note = {
    _id: ulid(),
    text: noteText,
    createdDate: new Date().getTime(),
    editedDate: new Date().getTime(),
  };
  await Note.create(note).save();
};

export const deleteNote = async (Note: NoteCollection, noteId: string) => {
  await Note.delete(noteId);
};

export const updateNote = async (Note: NoteCollection, note: INote) => {
  await Note.save(note);
};
