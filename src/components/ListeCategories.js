import xBtn from "../img/xBtn.png";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

function ListeCategories({
  categories,
  db,
  newCategorie,
  setCategories,
  setNewCategorie,
}) {
  // GESTION CATEGORIES //
  const addCategorie = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    const categoriesCollection = collection(db, "categories");

    const newCategorieWithUser = {
      ...newCategorie,
      userId: auth.currentUser.uid,
    };
    const docRef = await addDoc(categoriesCollection, newCategorieWithUser);

    setCategories((prevCategories) => [
      ...prevCategories,
      { ...newCategorieWithUser, id: docRef.id },
    ]);

    setNewCategorie({
      nom: "",
      color: "",
      tempsEffectue: 0,
      tachesActives: 0,
    });
  };

  const removeCategorie = (nom) => {
    setCategories((prevCategories) =>
      prevCategories.filter((categorie) => categorie.nom !== nom)
    );
  };

  const handleCategorieChange = (event) => {
    const { name, value } = event.target;
    setNewCategorie((prevCategorie) => ({
      ...prevCategorie,
      [name]: value,
    }));
  };
  return (
    <>
      <div className="w-1/2 flex flex-col items-center justify-between bg-white border border-gray-200  rounded-xl transition-all">
        <h3 className="text-center font-bold p-3">Categories</h3>
        <ul className="overflow-y-auto w-5/6 flex-1  py-2 rounded-md space-y-2 border ">
          {categories.map((categorie) => (
            <li
              key={categorie.id}
              value={categorie.nom}
              className="bg-blue-custom bg-opacity-10 border-white flex items-center"
            >
              <div className="flex w-full p-2 text-justify items-center  gap-2">
                <span
                  className="w-4 h-4 rounded-full flex shadow-sm "
                  style={{ background: categorie.color }}
                ></span>
                <span className="w-1/4">{categorie.nom}</span>
                <span className="text-sm flex-1">
                  {categorie.tachesActives} tâches actives /{" "}
                  {categorie.tachesCompletes} complétées
                </span>

                <button
                  className="w-10"
                  onClick={() => removeCategorie(categorie.nom)}
                >
                  <img
                    src={xBtn}
                    alt="Delete button"
                    className="w-4 opacity-20 hover:opacity-100 hover:w-5 transition-all duration-200 ease-in-out"
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {/* AJOUT CATEGORIE */}
        <form className="flex p-4 gap-5" onSubmit={addCategorie}>
          <input
            type="color"
            value={newCategorie.color}
            name="color"
            onChange={handleCategorieChange}
            className="bg-white"
          ></input>

          <input
            value={newCategorie.nom}
            name="nom"
            onChange={handleCategorieChange}
            placeholder="Nom de la categorie"
            className="border-b border-cyan-950 text-center text-sm w-full "
          ></input>

          <button
            type="submit"
            className="relative h-8 w-full inline-flex items-center justify-start inline-block px-5 py-1 overflow-hidden font-medium transition-all bg-blue-custom rounded-lg hover:bg-green-300 group"
          >
            <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-green-300 rounded-full"></span>
            <span className="px-2 text-sm relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-blue-custom">
              {" "}
              Ajouter une categorie
            </span>
          </button>
        </form>
      </div>
    </>
  );
}

export default ListeCategories;
