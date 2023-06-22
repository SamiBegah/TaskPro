import { useState, useRef } from "react";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import Add from "../img/add.png";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import Done from "../img/done.png";
import ListeCategories from "./ListeCategories";
import Notes from "./Notes";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth";

function TodoList({
  tasks,
  setTasks,
  newTask,
  setNewTask,
  categories,
  setCategories,
  newCategorie,
  setNewCategorie,
  setNotifications,
  db,
  sessionActive,
  setSessionActive,
}) {
  // GESTION DES TACHES
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [originalTask, setOriginalTask] = useState(null);

  // Ajout de tâches dans l'utilisateur correspondant
  const addTask = async (event) => {
    event.preventDefault();
    const auth = getAuth();

    const taskCollection = collection(db, "taches");

    const newTaskWithIdAndUser = {
      ...newTask,
      userId: auth.currentUser.uid,
      dateDue: newTask.dateDue,
    };
    const docRef = await addDoc(taskCollection, newTaskWithIdAndUser);

    setTasks((prevTasks) => [
      ...prevTasks,
      { ...newTaskWithIdAndUser, id: docRef.id },
    ]);
    setNewTask((prevTask) => ({
      ...prevTask,
      id: prevTask.id + 1,
      nom: "",
      categorie: "",
      dateDue: "",
    }));
  };

  // Modification de tâche
  const modifyTask = async (id) => {
    try {
      const db = getFirestore();
      const taskRef = doc(db, "taches", id);

      const taskDoc = await getDoc(taskRef);
      if (!taskDoc.exists) {
        console.error(`Aucune tache trouvée avec le id: ${id}`);
        return;
      }
      const updatedTask = { ...taskDoc.data(), ...editTask };

      await updateDoc(taskRef, updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error(
        `Erreur durant la mise à jour de la tache id #${id}: `,
        error
      );
    }
  };

  // Suppression de tâche
  const removeTask = async (id) => {
    const db = getFirestore();
    const taskRef = doc(db, "taches", id);
    await deleteDoc(taskRef);

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Modification de tache
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    // Validation de la date due de la tache (doit etre max 1 an dans le futur)
    if (name === "dateDue") {
      const selectedDate = new Date(value);
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      if (selectedDate > oneYearFromNow) {
        alert("La date maximum est de 1 ans à partir d'aujourdhui.");
        return;
      }
    }
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleEditTaskChange = (event) => {
    const { name, value } = event.target;
    setEditTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Sauvegarde de la modification d'une tâche
  const saveTask = () => {
    modifyTask(editTaskId, editTask);
    setEditTaskId(null);
    setEditTask(null);
  };

  // Annuler les modifications d'une tâche
  const cancelEditTask = () => {
    if (originalTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === originalTask.id ? originalTask : task
        )
      );
    }
    setEditTaskId(null);
    setEditTask(null);
    setOriginalTask(null);
  };

  // GESTION DES SEANCES DE TACHES (notifications Timer) //
  // Ajouter une seance notification
  const addNotification = (task, type) => {
    const newNotification = {
      id: uuidv4(),
      nom: task.nom,
      categorie: task.categorie,
      type: type,
    };

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);
  };

  // Gestion de la fin de tache
  const handleCheckboxChange = useCheckboxChangeHandler();

  function useCheckboxChangeHandler() {
    const notificationTimeoutRef = useRef(null);

    const handleCheckboxChange = (task) => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }

      const timeoutId = setTimeout(() => {
        removeTask(task.id);
        setTasks((prevTasks) =>
          prevTasks.filter((prevTask) => prevTask.id !== task.id)
        );
        // Mettre a jour les statistics dans la categorie correspondante
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.nom === task.categorie
              ? {
                  ...category,
                  tachesCompletes: category.tachesCompletes + 1,
                  tachesActives: category.tachesActives - 1,
                }
              : category
          )
        );
        // Message de fin de tache
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            id: prevNotifications.length,
            contenu: `Bravo, la tache "${task.nom}" est complétée!`,
            type: "notif",
            color: "bg-green-300",
            undo: () => handleCancel(task),
          },
        ]);
      }, 500);

      notificationTimeoutRef.current = timeoutId;
    };

    return handleCheckboxChange;
  }

  // Retourner la tache à son statut incomplet
  const handleCancel = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.nom === task.categorie
          ? {
              ...category,
              tachesCompletes: category.tachesCompletes - 1,
              tachesActives: category.tachesActives + 1,
            }
          : category
      )
    );
  };

  return (
    <section className="flex-1 w-full space-y-2 h-full p-2 my-2  border rounded-xl bg-white">
      <div className="flex flex-col gap-2 w-full h-full p-1  ">
        <div className="relative flex flex-col items-center-gray-200  bg-white rounded-lg w-full h-2/3 p-5  gap-2">
          <h1 className="text-xl text-left font-bold p-2 w-full">
            Tableau de bords
          </h1>
          <div className="w-full flex py-1">
            <div className="w-16"></div>
            <div className="w-2/6 text-center font-bold">Tache</div>
            <div className="w-1/6 text-center font-bold">Categorie</div>
            <div className="w-1/6 text-center font-bold">Date dû</div>
            <div className="w-2/6 text-center font-bold"></div>
          </div>
          <div className="flex flex-col w-full overflow-y-auto max-h-[350px] gap-2 border-gray-200 text-black p-2 ">
            {/* TACHES LISTEES */}

            {tasks.map((task) => (
              <div
                className="flex text-md bg-opacity-20 w-full h-12"
                key={task.id}
              >
                <div className="w-16 flex justify-center items-center  rounded-l-xl bg-blue-custom  border-blue-custom border-t border-l border-b border-opacity-20 ">
                  {editTaskId === task.id ? (
                    <div className="w-5 h-5 outline-none appearance-none border bg-white opacity-50 transition-all duration-500 ease-in-out"></div>
                  ) : (
                    <div
                      onClick={() => handleCheckboxChange(task)}
                      className="w-5 h-5 outline-none appearance-none border bg-white transition-all duration-500 ease-in-out"
                    >
                      <img
                        className="opacity-0 hover:opacity-100 transition-all ease-out duration-200 cursor-pointer"
                        src={Done}
                        alt="Compléter la tâche"
                      />
                    </div>
                  )}
                </div>
                <div
                  className="flex w-full bg-blue-custom bg-opacity-20 rounded-r-xl  border-blue-custom border border-opacity-20
                "
                >
                  {/* POSSIBLITE DE MODIFICATION DE TACHE */}
                  <div className="w-2/6  flex justify-center items-center">
                    {editTaskId === task.id ? (
                      <input
                        value={editTask.nom}
                        name="nom"
                        onChange={handleEditTaskChange}
                        placeholder="Nom de la tache"
                        className=" border-cyan-950 text-center border-b m-2"
                      />
                    ) : (
                      task.nom
                    )}
                  </div>
                  <div className="w-1/6  flex justify-center items-center ">
                    {editTaskId === task.id ? (
                      <select
                        value={editTask.categorie}
                        name="categorie"
                        onChange={handleEditTaskChange}
                        type="text"
                        className=" border-cyan-950 border-b text-center appearance-none m-2"
                      >
                        <option className="text-gray-500" value="" disabled>
                          Categorie
                        </option>
                        {categories.map((categorie) => (
                          <option key={categorie.nom} value={categorie.nom}>
                            {categorie.nom}
                          </option>
                        ))}
                      </select>
                    ) : (
                      task.categorie
                    )}
                  </div>
                  <div className="w-1/6  flex justify-center items-center ">
                    {editTaskId === task.id ? (
                      <input
                        type="date"
                        name="dateDue"
                        value={editTask.dateDue}
                        onChange={handleEditTaskChange}
                        className="border-cyan-950 text-center border-b m-2"
                      />
                    ) : (
                      new Date(task.dateDue).toISOString().split("T")[0]
                    )}
                  </div>
                  <div className="w-2/6  flex justify-center items-center  rounded-r-xl gap-2">
                    {editTaskId === task.id ? (
                      <>
                        <button
                          className="relative h-8 inline-flex items-center justify-start inline-block px-5 py-1 overflow-hidden font-medium transition-all bg-blue-custom rounded-lg hover:bg-white group"
                          onClick={saveTask}
                        >
                          <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
                          <span className="text-sm relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-blue-custom">
                            Enregistrer
                          </span>
                        </button>
                        <button
                          className="relative h-8 inline-flex items-center justify-start inline-block px-5 py-1 overflow-hidden font-medium transition-all bg-blue-custom rounded-lg hover:bg-white group"
                          onClick={cancelEditTask}
                        >
                          <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
                          <span className="text-sm relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-blue-custom">
                            Annuler
                          </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          disabled={sessionActive}
                          className="relative h-8 inline-flex items-center justify-start inline-block px-5 py-1 overflow-hidden font-medium transition-all bg-blue-custom rounded-lg hover:bg-white group"
                          onClick={() => {
                            addNotification(task, "timer");
                            setSessionActive(true);
                          }}
                        >
                          <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
                          <span className="text-sm relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-blue-custom">
                            Lancer une seance
                          </span>
                        </button>
                        <button
                          className="flex justify-center items-center w-10 h-10 gap-2  text-cyan-950"
                          onClick={() => {
                            setEditTask(task);
                            setEditTaskId(task.id);
                          }}
                        >
                          <img
                            className="w-7 hover:w-9 transition-all duration-200 ease-in-out"
                            src={Edit}
                            alt="Edit icon"
                          />
                        </button>
                        <button
                          className="flex justify-center items-center w-10 h-10 gap-2 rounded-full text-cyan-950"
                          onClick={() => removeTask(task.id)}
                        >
                          <img
                            className="w-7 hover:w-9 transition-all duration-200 ease-in-out"
                            src={Delete}
                            alt="Delete icon"
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AJOUT DE TACHES */}
          <div className="flex absolute bottom-0 left-0 w-full rounded-b-xl justify-center  px-2 py-2 pb-3">
            <form
              onSubmit={addTask}
              className="flex w-full text-md border-blue-custom border border-opacity-50 rounded-xl "
            >
              <div className="w-16 flex justify-center items-center p-1 rounded-l-xl">
                <img className="w-3/4" src={Add} alt="Add icon" />
              </div>
              <div className="w-2/6  flex justify-center items-center p-2">
                <input
                  value={newTask.nom}
                  name="nom"
                  required
                  maxLength={40}
                  onChange={handleNewTaskChange}
                  placeholder="Nom de la tache"
                  className="border-b border-cyan-950 text-center "
                ></input>
              </div>
              <div className="w-1/6 flex justify-center items-center p-2">
                <select
                  value={newTask.categorie}
                  name="categorie"
                  onChange={handleNewTaskChange}
                  required
                  type="text"
                  className="border border-cyan-950 rounded-lg text-center"
                >
                  <option className="text-gray-500" value="" disabled>
                    Categorie
                  </option>
                  {categories.map((categorie) => (
                    <option key={categorie.nom} value={categorie.nom}>
                      {categorie.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/6 flex justify-center items-center p-2">
                <input
                  type="date"
                  name="dateDue"
                  value={newTask.dateDue}
                  required
                  onChange={handleNewTaskChange}
                  className="border-b border-cyan-950 text-center"
                ></input>
              </div>
              <div className="w-2/6 flex justify-around items-center p-2 rounded-r-xl">
                <button
                  type="submit"
                  className="relative h-8 inline-flex items-center justify-start inline-block px-5 py-1 overflow-hidden font-medium transition-all bg-blue-custom rounded-lg hover:bg-green-300 group"
                >
                  <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-green-300 rounded-full"></span>
                  <span className="text-sm relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-black">
                    Ajouter une tache
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex h-1/3">
          <div className="flex gap-3 w-full h-full">
            {/* ZONE DE NOTES */}
            <Notes db={db} />
            {/* CATEGORIES*/}
            <ListeCategories
              tasks={tasks}
              categories={categories}
              db={db}
              newCategorie={newCategorie}
              setCategories={setCategories}
              setNewCategorie={setNewCategorie}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TodoList;
