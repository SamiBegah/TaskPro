import Logo from "../img/logo.png";
import Exit from "../img/exit.png";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

function NavBar() {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // DECONNEXION
  const handleDeconnexion = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erreur de deconnexion: ", error);
    }
  };

  return (
    <section className=" bg-blue-custom shadow-md p-4 rounded-xl mb-1 w-full bg-opacity-95 flex  justify-around px-10 items-center z-10">
      <div className=" absolute left-5 w-1/12 ">
        <img
          className="w-8  self-center animate-spin"
          src={Logo}
          alt="TaskPro logo"
          style={{ animationDuration: "15000ms" }}
        />
      </div>

      <div className="h-full w-1/6 flex justify-center items-center">
        <Link
          to="/hub/todo"
          className={`flex justify-center items-center px-2 py-1 rounded-xl shadow-sm transition-all duration-200 ${
            location.pathname === "/hub/todo"
              ? "bg-white text-black"
              : "text-white"
          }`}
        >
          <span className="text-left"> Accueil </span>
        </Link>
      </div>
      <div className="h-full w-1/6 flex justify-center items-center ">
        <Link
          to="/hub/statistics"
          className={`flex justify-center items-center px-2 py-1 rounded-xl shadow-sm transition-all duration-200 ${
            location.pathname === "/hub/statistics"
              ? "bg-white text-black"
              : "text-white"
          }`}
        >
          <span className="text-left"> Statistiques </span>
        </Link>
      </div>
      <div className="h-full w-1/6 flex justify-center items-center">
        <Link
          to="/hub/calendrier"
          className={`flex justify-center items-center px-2 py-1 rounded-xl shadow-sm transition-all duration-200 ${
            location.pathname === "/hub/calendrier"
              ? "bg-white text-black"
              : "text-white"
          }`}
        >
          <span className="text-left"> Calendrier </span>
        </Link>
      </div>
      <div className="h-full w-1/6 flex justify-center items-center">
        <Link
          to="/hub/parametres"
          className={`flex justify-center items-center px-2 py-1 rounded-xl shadow-sm transition-all duration-200 ${
            location.pathname === "/hub/parametres"
              ? "bg-white text-black"
              : "text-white"
          }`}
        >
          <span className="text-left"> Paramètres </span>
        </Link>
      </div>
      <div className="h-full absolute right-2 flex justify-center items-center">
        <button
          className="flex justify-center  p-2 text-white  rounded-xl "
          onClick={handleDeconnexion}
        >
          <img
            className="w-4/6 hover:w-5/6 transition-all duration-200 delay-50 ease-in-out"
            src={Exit}
            alt="Deconnexion"
          />
        </button>
      </div>
    </section>
  );
}

export default NavBar;
