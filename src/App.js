import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Accueil from "./components/Accueil";
import Connexion from "./components/Connexion";
import Inscription from "./components/Inscription";

import Hub from "./components/Hub";

import "./App.css";

function App() {
  return (
    <div className="font-OpenSans bg p-2 flex gap-10 justify-center h-screen overflow-y-hidden ">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Accueil />
                <Connexion />
              </>
            }
          />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/hub/*" element={<Hub />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
