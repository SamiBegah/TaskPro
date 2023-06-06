import { useState } from "react";

import Add from "../img/add.png";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";

function TodoList() {
  const [tasks, setTasks] = useState([
    {
      id: 0,
      nom: "Exemple de tache",
      categorie: "Tutoriel",
      dateDue: "05/26/2023",
    },
  ]);

  const [newTask, setNewTask] = useState({
    id: 1,
    nom: "",
    categorie: "",
    dateDue: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const addTask = (event) => {
    event.preventDefault();
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTask({
      id: newTask.id + 1,
      nom: "",
      categorie: "",
      dateDue: "",
    });
  };

  const [categories, setCategories] = useState([
    "Travail",
    "Ecole",
    "Financiere",
  ]);

  const [newCategorie, setNewCategorie] = useState({ nom: "" });

  const handleCategorieChange = (event) => {
    const { name, value } = event.target;
    setNewCategorie((prevCategorie) => ({
      ...prevCategorie,
      [name]: value,
    }));
  };

  const addCategorie = (event) => {
    event.preventDefault();
    setCategories((prevCategories) => [...prevCategories, newCategorie.nom]);
    setNewCategorie({ nom: "" });
  };

  return (
    <section className="flex-1 flex-col bg-cyan-500 bg-opacity-50 p-4 space-y-2 h-full ">
      <h1 className="text-xl font-bold p-2"> Tableau de bord </h1>
      <div className=" flex flex-col gap-2 h-full ">
        <div className="w-full h-4/6 bg-white rounded-xl shadow-md p-2 py-2">
          <div className="flex py-1 ">
            <div className=" w-8"></div>
            <div className=" flex-1 text-center font-bold"> Tache</div>
            <div className=" w-28 text-center font-bold">Categorie</div>
            <div className=" w-24 text-center font-bold"> Date dû</div>
            <div className=" w-52 text-center font-bold"></div>
          </div>

          {tasks.map((task) => (
            <div className="flex text-sm bg-white rounded-xl shadow-inner pb-1">
              <div className=" w-8 border-l border-t border-b flex justify-center items-center p-2 rounded-l-xl">
                <input type="checkbox" className=" " />
              </div>
              <div className=" flex-1 border-y  flex justify-center items-center p-2">
                {task.nom}
              </div>
              <div className=" w-28 border-y flex justify-center items-center p-2">
                {task.categorie}
              </div>
              <div className=" w-24 border-y flex justify-center items-center p-2">
                {task.dateDue}
              </div>
              <div className=" w-52 border-y flex justify-around items-center p-2 rounded-r-xl">
                <button className="flex justify-center items-center w-32 h-8 gap-2 bg-gradient rounded-full text-cyan-950 shadow-md">
                  <p className="text-white text-xs"> Lancer une seance</p>
                </button>
                <button className="flex justify-center items-center w-8 h-8 gap-2 bg-white rounded-full text-cyan-950 shadow-md">
                  <img className="w-7" src={Edit} alt="Edit icon" />
                </button>
                <button className="flex justify-center items-center w-8 h-8 gap-2 bg-white rounded-full text-cyan-950 shadow-md">
                  <img className="w-7" src={Delete} alt="Edit icon" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex py-1  ">
            <form
              onSubmit={addTask}
              className="flex w-full text-sm bg-white rounded-xl shadow-inner"
            >
              <div className=" w-10 border-l border-t border-b flex justify-center items-center p-2 rounded-l-xl">
                <img src={Add} alt="Add icon" />
              </div>
              <div className=" flex-1 border-y  flex justify-center items-center p-2">
                <input
                  value={newTask.nom}
                  name="nom"
                  onChange={handleInputChange}
                  placeholder="Nom de la tache"
                  className="border-b border-cyan-950 text-center "
                ></input>
              </div>
              <div className=" w-28 border-y flex justify-center items-center p-2">
                <select
                  value={newTask.categorie}
                  name="categorie"
                  onChange={handleInputChange}
                  type="text"
                  className="border border-cyan-950 rounded-lg w-3/4 text-center"
                >
                  {categories.map((categorie) => (
                    <option value={categorie}> {categorie} </option>
                  ))}
                </select>
              </div>
              <div className=" w-28 border-y flex justify-center items-center p-2">
                <input
                  type="date"
                  name="dateDue"
                  value={newTask.dateDue}
                  onChange={handleInputChange}
                  className="border-b border-cyan-950"
                ></input>
              </div>
              <div className=" w-48 border-y flex justify-around items-center p-2 rounded-r-xl">
                <button
                  type="submit"
                  className="flex justify-center items-center h-8 w-32 gap-2 bg-gradient rounded-full text-cyan-950 shadow-md"
                >
                  <p className="text-white text-xs"> Ajouter la tache</p>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex h-2/6">
          <div className=" flex gap-3 w-full">
            <div className="w-1/2 h-5/6 flex flex-col items-center justify-between bg-white  rounded-xl shadow-md hover:opacity-100 transition-all">
              <h3 className="text-center p-2"> Categories </h3>
              <ul className=" overflow-y-auto w-5/6 flex-1 border p-2 rounded-md">
                {categories.map((categorie) => (
                  <li value={categorie}> {categorie} </li>
                ))}
              </ul>
              <form className="flex p-4" onSubmit={addCategorie}>
                <input
                  value={newCategorie.nom}
                  name="nom"
                  onChange={handleCategorieChange}
                  placeholder="Nom de la categorie"
                  className="border-b border-cyan-950 text-center text-sm w-full "
                ></input>

                <button
                  type="submit"
                  className="flex justify-center items-center h-8 w-32 gap-2 bg-gradient rounded-full text-cyan-950 shadow-md"
                >
                  <p className="text-white text-xs"> Ajouter</p>
                </button>
              </form>
            </div>

            <div className="w-1/2 h-5/6 bg-white opacity-100 rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-center p-2"> Notes </h3>
              <textarea className="w-5/6 h-full mb-5 p-2 border overflow-y-auto rounded-xl shadow-sm resize-none outline-none "></textarea>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default TodoList;
