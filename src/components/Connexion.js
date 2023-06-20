import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Connexion({ logo }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const auth = getAuth();

  // GESTION DE LA CONNEXION (avec firebase/auth)
  const handleConnexion = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/hub/todo");
    } catch (error) {
      // Validation des informations de connexion
      if (error.code === "auth/user-not-found") {
        setError("Cet adresse email ne correspond à aucun utilisateur.");
      } else if (error.code === "auth/invalid-email") {
        setError("Cette adresse courriel n'est pas valide.");
      } else if (error.code === "auth/wrong-password") {
        setError("Le mot de passe est incorrecte.");
      } else {
        setError("Erreur de connexion.");
      }
    }
  };

  return (
    <div className="m-5 rounded-2xl flex flex-col justify-center w-1/2 min-w-sm max-w-xl h-fit bg-white bg-opacity-95 px-10 py-10 shadow-xl">
      <div className="m-5 rounded-xl flex flex-col justify-center items-center gap-5">
        <img
          className="w-1/4 self-center animate-spin
"
          src={logo}
          alt="TaskPro logo"
          style={{ animationDuration: "10000ms" }}
        />
        {/*<a href="https://www.flaticon.com/free-icons/icosahedron" title="icosahedron icons">Icosahedron icons created by Freepik - Flaticon</a>*/}
        <h1 className="text-6xl text-blue-custom text-center font-Montserrat">
          TaskPro
        </h1>
      </div>
      <br />
      <p className=" text-md text-center line leading-7">
        {" "}
        Organisez, accomplissez et faites le suivi de vos{" "}
        <span className="font-bold text-blue-custom">tâches</span> comme un{" "}
        <span className="font-bold text-blue-custom">pro</span>, dans une seule
        plateforme qui regroupe tout pour vous !
      </p>
      <br />

      {/* Formulaire de connexion */}
      <form className="flex flex-col gap-10" onSubmit={handleConnexion}>
        <div className=" p-5 flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="text-gray-500"> Courriel </label>
            <input
              type="email"
              className="py-2 mt-1 border-b-2 rounded-md pl-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-gray-500"> Mot de passe </label>
            <input
              type="password"
              className="py-2 mt-1 border-b-2 rounded-md pl-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="absolute -bottom-10 text-red-500">{error}</p>
            )}
          </div>
          <p className="text-xs text-right text-gray-700">
            Mot de passe <span className="font-bold"> oublié?</span>
          </p>
        </div>

        <button
          type="submit"
          className="font-bold rounded-2xl bg-blue-custom text-white p-2 text-center border border-white "
        >
          Se connecter
        </button>
      </form>
      <br />
      <div className="flex justify-center items-center">
        <div className="border-b w-1/2"></div>
        <span className="px-2 text-sm text-gray-400"> ou </span>
        <div className="border-b w-1/2"></div>
      </div>
      <br />
      <button
        onClick={() => navigate("/inscription")}
        className="font-bold rounded-2xl  text-black p-2 text-center shadow-sm border border-gray-200 "
      >
        Créer un nouveau compte
      </button>
    </div>
  );
}

export default Connexion;
