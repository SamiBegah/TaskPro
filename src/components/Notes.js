import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

function Notes({ db }) {
  // GESTION DES NOTES //
  const auth = getAuth();
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchUserNote = async () => {
      const notesCollectionRef = collection(db, "notes");
      const notesQuery = query(
        notesCollectionRef,
        where("userId", "==", auth.currentUser.uid)
      );
      const notesQuerySnapshot = await getDocs(notesQuery);

      if (!notesQuerySnapshot.empty) {
        const userNote = notesQuerySnapshot.docs[0].data();
        setNote(userNote.note);
      }
    };

    fetchUserNote();
  }, [db, auth.currentUser]);

  useEffect(() => {
    const updateNote = async () => {
      const notesCollectionRef = collection(db, "notes");
      const notesQuery = query(
        notesCollectionRef,
        where("userId", "==", auth.currentUser.uid)
      );
      const notesQuerySnapshot = await getDocs(notesQuery);

      if (!notesQuerySnapshot.empty) {
        const userNoteDoc = notesQuerySnapshot.docs[0];
        await updateDoc(userNoteDoc.ref, { note });
      }
    };

    updateNote();
  }, [db, auth.currentUser, note]);
  return (
    <div className="w-1/2 h-full bg-white border border-gray-200 rounded-xl flex flex-col items-center">
      <h3 className="text-center font-bold p-3">Notes</h3>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows="4"
        className="w-5/6 h-5/6  p-3 text-sm  bg-blue-custom bg-opacity-10 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Ecrivez vos notes ici..."
      ></textarea>
    </div>
  );
}

export default Notes;
