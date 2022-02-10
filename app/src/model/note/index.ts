import { NoteCollection, INote } from '@eduvault/sdk-js';
import { ulid } from 'ulid';

export const fetchNotes = async (Note: NoteCollection) => {
  const noteInstances = await Note.find({});
  const parsed: INote[] = [];
  if (noteInstances && Object.keys(noteInstances).length > 0)
    await noteInstances.each((note) => {
      // console.log('note to json', note.toJSON());
      if (!note._deleted) parsed.push(note.toJSON() as any);
    });
  // console.log({ parsed });
  return parsed;
};

export const noteCreate = async (Note: NoteCollection, noteText: string) => {
  const note: INote = {
    _id: ulid(),
    _created: new Date().getTime(),
    _mod: new Date().getTime(),
    text: noteText,
  };
  await Note.create(note).save();
};

export const noteUpdate = async (Note: NoteCollection, note: INote) => {
  await Note.save(note);
};

export const noteDelete = async (Note: NoteCollection, note: INote) => {
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  const noteWithDeleteFlag: INote = {
    ...note,
    _deleted: true,
    _ttl: new Date().getTime() + dayInMilliseconds * 30,
  };
  await Note.save(noteWithDeleteFlag);
  // await Note.delete(noteId); // using .delete() is not recommended because it will not trigger the client listener update hooks.
};
