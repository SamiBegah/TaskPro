import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

function Inscription({ db, logo }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // GESTION DE L'INSCRIPTION (avec firebase/auth)
  const handleSignUp = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passes ne correspondent pas.");
      return;
    }
    // Creation de l'utilisateur
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Creation de l'utilisateur dans firebase
      const inscriptionDate = new Date().toISOString();
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        userId: userCredential.user.uid,
        name,
        email,
        dateInscription: inscriptionDate,
        weatherLocation: "Montreal",
      });

      // Creation du blocnotes
      const notesCollectionRef = collection(db, "notes");
      await addDoc(notesCollectionRef, {
        note: "",
        userId: userCredential.user.uid,
      });

      // Ajout les categories par default
      const defaultCategories = [
        {
          nom: "Tutoriel",
          tempsEffectue: 0,
          tachesActives: 0,
          tachesCompletes: 0,
          date: inscriptionDate,
          color: "aliceblue",
        },
        {
          nom: "Social",
          tempsEffectue: 0,
          tachesActives: 0,
          tachesCompletes: 0,
          date: inscriptionDate,
          color: "fuchsia",
        },
        {
          nom: "Travail",
          tempsEffectue: 0,
          tachesActives: 0,
          tachesCompletes: 0,
          date: inscriptionDate,
          color: "blue",
        },
        {
          nom: "Etudes",
          tempsEffectue: 0,
          tachesActives: 0,
          tachesCompletes: 0,
          date: inscriptionDate,
          color: "aquamarine",
        },
        {
          nom: "Santé",
          tempsEffectue: 0,
          tachesActives: 0,
          tachesCompletes: 0,
          date: inscriptionDate,
          color: "green",
        },
      ];

      const categoriesCollectionRef = collection(db, "categories");

      for (let category of defaultCategories) {
        const newCategory = {
          ...category,
          userId: userCredential.user.uid,
        };
        await addDoc(categoriesCollectionRef, newCategory);
      }
      // Ajout de la tache exemple
      const defaultTask = {
        nom: "Un exemple de tache",
        categorie: "Tutoriel",
        dateDue: inscriptionDate,
        userId: userCredential.user.uid,
      };

      const tasksCollectionRef = collection(db, "taches");
      await addDoc(tasksCollectionRef, defaultTask);

      navigate("/hub/todo");
      // Validation des informations d'inscription
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Cet adresse email est déjà utlisé.");
      } else if (error.code === "auth/invalid-email") {
        setError("Cette adresse courriel n'est pas valide.");
      } else if (error.code === "auth/weak-password") {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
      } else {
        setError(`Erreur d'inscription: ${error.message}`);
      }
    }
  };

  // Retour vers la page de connexion si compte déjà existant
  const handleSeConnecter = () => {
    navigate("/");
  };

  return (
    <div className="m-5 rounded-2xl flex flex-col justify-center w-1/2 min-w-sm max-w-xl h-fit bg-white bg-opacity-95 px-10 py-10 shadow-xl">
      <div className="m-5 rounded-xl flex flex-col justify-center items-center gap-5">
        <img
          className="w-1/4 h-1/4 self-center animate-spin
"
          src={logo}
          alt="TaskPro logo"
          style={{ animationDuration: "10000ms" }}
        />
        {/*<a href="https://www.flaticon.com/free-icons/icosahedron" title="icosahedron icons">Icosahedron icons created by Freepik - Flaticon</a>*/}
        <h1 className="text-6xl text-blue-custom text-center font-Montserrat">
          {" "}
          TaskPro
        </h1>
      </div>
      <br />
      <p className=" text-md text-center line leading-7">
        Créer un compte pour profiter de TaskPro{" "}
        <span className="font-bold">gratuitement</span>!
      </p>
      <br />

      {/* Formulaire d'inscription */}
      <form className="flex flex-col gap-5" onSubmit={handleSignUp}>
        <div className=" p-5 flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-500"> Nom </label>
            <input
              type="text"
              className="py-1 mt-1 border-b-2 rounded-md pl-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500"> Courriel </label>
            <input
              type="email"
              className="py-1 mt-1 border-b-2 rounded-md pl-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500"> Mot de passe </label>
            <input
              type="password"
              className="py-1 mt-1 border-b-2 rounded-md pl-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-gray-500"> Confirmer le mot de passe </label>
            <input
              type="password"
              className="py-1 mt-1 border-b-2 rounded-md pl-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="py-5 text-red-500">{error}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="font-bold rounded-2xl bg-blue-custom text-white p-2 text-center border border-white "
        >
          S'inscrire
        </button>
      </form>
      <br />
      {/* Redirection vers la connexion */}
      <button onClick={handleSeConnecter}>
        <p className="text-sm  text-gray-700 mt-3 text-center">
          ⬅️ je possède déjà un compte...
        </p>
      </button>
    </div>
  );
}

export default Inscription;
