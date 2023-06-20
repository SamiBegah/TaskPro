import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import logo from "./img/logo.png";
import Connexion from "./components/Connexion";
import Inscription from "./components/Inscription";
import Hub from "./components/Hub";

// CREATION ET GESTION DU CONTEXTE D'AUTHENTIFICATION (avec firebase/auth et firebase/firestore)
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [db, setDb] = useState();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const firestoreInstance = getFirestore();
    setDb(firestoreInstance);

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    db,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function App() {
  const { currentUser, db } = useAuth();

  return (
    <div className="font-OpenSans flex w-full  overflow-y-hidden justify-center items-center">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Connexion db={db} logo={logo} />
            </>
          }
        />
        <Route
          path="/inscription"
          element={
            <>
              <Inscription db={db} logo={logo} />
            </>
          }
        />
        <Route
          path="/hub/*"
          element={
            <AuthProvider>
              {currentUser ? <Hub db={db} /> : <Navigate to="/" />}
            </AuthProvider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
