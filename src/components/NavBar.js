import Logo from "../img/logo.png";
import Exit from "../img/exit.png";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

function NavBar() {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Deconnexion
  const handleDeconnexion = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erreur de deconnexion: ", error);
    }
  };

  // Barre de navigation, le titre de la page active devient blanc
  return (
    <section className=" bg-blue-custom shadow-md p-4 text-lg rounded-xl mb-2 w-full bg-opacity-95 flex  justify-around px-10 items-center z-10">
      <div className=" absolute left-7 flex flex-col items-center  ">
        <img
          className="w-8  self-center animate-spin"
          src={Logo}
          alt="TaskPro logo"
          style={{ animationDuration: "15000ms" }}
        />
        <span className="text-sm font-bold text-white">Task Pro</span>
      </div>

      <div className="h-full w-1/6 flex justify-center items-center">
        <Link
          to="/hub/todo"
          className={`flex justify-center items-center px-2 py-1 rounded-xl   transition-all duration-200 ${
            location.pathname === "/hub/todo"
              ? "bg-white text-black shadow-sm text-xl"
              : "text-white hover:scale-105"
          }`}
        >
          <span className="text-left"> Accueil </span>
        </Link>
      </div>
      <div className="h-full w-1/6 flex justify-center items-center ">
        <Link
          to="/hub/statistics"
          className={`flex justify-center items-center px-2 py-1 rounded-xl   transition-all duration-200 ${
            location.pathname === "/hub/statistics"
              ? "bg-white text-black shadow-sm text-xl"
              : "text-white hover:scale-105"
          }`}
        >
          <span className="text-left"> Statistiques </span>
        </Link>
      </div>
      <div className="h-full w-1/6 flex justify-center items-center">
        <Link
          to="/hub/calendrier"
          className={`flex justify-center items-center px-2 py-1 rounded-xl   transition-all duration-200 ${
            location.pathname === "/hub/calendrier"
              ? "bg-white text-black shadow-sm text-xl"
              : "text-white hover:scale-105"
          }`}
        >
          <span className="text-left"> Calendrier </span>
        </Link>
      </div>
      <div className="h-full w-1/6 flex justify-center items-center">
        <Link
          to="/hub/parametres"
          className={`flex justify-center items-center px-2 py-1 rounded-xl   transition-all duration-200 ${
            location.pathname === "/hub/parametres"
              ? "bg-white text-black shadow-sm text-xl"
              : "text-white hover:scale-105"
          }`}
        >
          <span className="text-left"> Paramètres </span>
        </Link>
      </div>
      <div className="h-full absolute right-6 flex justify-center items-center">
        <button
          className="flex flex-col justify-center items-center hover:scale-105 transition-all ease-in-out duration-500  p-2 text-white  rounded-xl "
          onClick={handleDeconnexion}
        >
          <img
            className="w-10 transition-all duration-200 delay-50 ease-in-out"
            src={Exit}
            alt="Deconnexion"
          />
          <span className="text-sm">Quitter</span>
        </button>
      </div>
    </section>
  );
}

export default NavBar;
