import Logo from "../img/logo.png";
import TodoList from "../img/todo-list.png";
import Statistics from "../img/statistics.png";
import Calendar from "../img/calendar.png";
import Settings from "../img/settings.png";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <section className="rounded-tl-xl rounded-bl-xl w-32 bg-cyan-950 bg-opacity-95 flex flex-col justify-around items-center">
      <div className="flex flex-col text-center gap-2 py-2">
        <img
          className="w-3/5 animate-spin self-center
      "
          src={Logo}
          alt="TaskPro logo"
          style={{ animationDuration: "15000ms" }}
        />
        {/*<a href="https://www.flaticon.com/free-icons/icosahedron" title="icosahedron icons">Icosahedron icons created by Freepik - Flaticon</a>*/}
        <h1 className="text-lg text-white  font-Montserrat"> TaskPro</h1>
      </div>
      <div className="h-1/6 w-full flex justify-center items-center">
        <Link
          to="/hub/todo"
          className="flex justify-center w-3/5 h-3/6 bg-white  rounded-xl shadow-sm shadow-black"
        >
          <img
            className="w-3/5 self-center
      "
            src={TodoList}
            alt="To-do list menu icon"
          />
        </Link>
      </div>
      <div className="h-1/6 w-full flex justify-center items-center ">
        <Link
          to="/hub/statistics"
          className="flex justify-center w-3/5 h-3/6 bg-white  rounded-xl shadow-sm shadow-black"
        >
          <img
            className="w-3/5 self-center
      "
            src={Statistics}
            alt="Statistics menu icon"
          />
        </Link>
      </div>
      <div className="h-1/6 w-full flex justify-center items-center">
        <Link
          to="/hub/calendrier"
          className="flex justify-center w-3/5 h-3/6 bg-white  rounded-xl shadow-sm shadow-black"
        >
          <img
            className="w-3/5 self-center
      "
            src={Calendar}
            alt="Calendar menu icon"
          />
        </Link>
      </div>
      <div className="h-1/6 w-full flex justify-center items-center">
        <Link
          to="/hub/parametres"
          className="flex justify-center w-3/5 h-3/6 bg-white  rounded-xl shadow-sm shadow-black"
        >
          <img
            className="w-3/5 self-center
      "
            src={Settings}
            alt="Settings menu icon"
          />
        </Link>
      </div>
    </section>
  );
}

export default NavBar;
