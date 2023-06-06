import { Routes, Route } from "react-router-dom";
import TodoList from "./TodoList";
import Statistics from "./Statistics";
import Calendrier from "./Calendrier";
import Parametres from "./Parametres";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

function Hub() {
  return (
    <div className="rounded-xl flex bg-white opacity-90 shadow-md border border-gray-200 w-full min-h-screen">
      <NavBar />
      <div className="flex-1 h-full ">
        <Routes>
          <Route path="/todo" element={<TodoList />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/calendrier" element={<Calendrier />} />
          <Route path="/parametres" element={<Parametres />} />
        </Routes>
      </div>
      <SideBar />
    </div>
  );
}

export default Hub;
