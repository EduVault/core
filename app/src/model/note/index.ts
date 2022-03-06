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
    // _updatedAt: new Date().getTime(),
    text: noteText,
  };
  await Note.create(note).save();
};

export const checkForChanges = (note: INote, existingNote: INote) => {
  let changed = false;
  if (note.text !== existingNote.text) changed = true;
  if (existingNote._deleted !== note._deleted) changed = true;
  if (changed) {
    if (existingNote._updatedAt && note._updatedAt) {
      console.log(
        'existingNote._updatedAt , note._updatedAt',
        existingNote._updatedAt,
        note._updatedAt
      );
      console.log(
        'existingNote , new',
        new Date(existingNote._updatedAt),
        new Date(note._updatedAt)
      );
      if (existingNote._updatedAt > note._updatedAt) return false;
    }
  }
  return changed;
};

export const noteUpdate = async (
  Note: NoteCollection,
  noteRaw: INote,
  updateUpdatedAt = true
) => {
  // compare note._updatedAt with existing note._updatedAt and note._created and update if necessary

  const note = {
    ...noteRaw,
    _updatedAt: updateUpdatedAt ? new Date().getTime() : noteRaw._updatedAt,
  };
  const existingNote = await Note.findById(note._id);

  if (existingNote) {
    if (checkForChanges(note, existingNote)) {
      console.log('saving note');
      await Note.save(note);
      return true;
    }
  } else {
    await Note.insert(note);
    return true;
  }
  return false;
};

export const noteDelete = async (Note: NoteCollection, note: INote) => {
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  const noteWithDeleteFlag: INote = {
    ...note,
    _updatedAt: new Date().getTime(),
    _deleted: true,
    _ttl: new Date().getTime() + dayInMilliseconds * 30,
  };
  await Note.save(noteWithDeleteFlag);
  // await Note.delete(noteId); // using .delete() is not recommended because it will not trigger the client listener update hooks.
};
