import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import TodoList from "./TodoList";
import Statistics from "./Statistics";
import Calendrier from "./Calendrier";
import Parametres from "./Parametres";
import NavBar from "./NavBar";
import Notifications from "./Notifications";

function Hub({ db }) {
  const auth = getAuth();
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionActive, setSessionActive] = useState(false);

  const [newTask, setNewTask] = useState({
    id: 1,
    nom: "",
    categorie: "",
    dateDue: "",
  });

  const [newCategorie, setNewCategorie] = useState({
    nom: "",
    color: getRandomColor(),
    tempsEffectue: 0,
    tachesActives: 0,
  });

  // Mettre a jour la ville pour l'api meteo //
  const [weatherLocation, setWeatherLocation] = useState("");
  const updateWeatherLocationInDb = async (newLocation) => {
    const userDoc = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDoc, {
      weatherLocation: newLocation,
    });
    setWeatherLocation(newLocation);
  };

  // Génération de couleurs aléatoire pour les catégories
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // RECUPERATION DES DONNES UTILISATEURS DE FIRESTORE
  useEffect(() => {
    let unsubscribeUserDoc; // Declare outside of function

    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user) {
        const fetchUserData = async () => {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
              // Assign return value here
              setUserData(docSnapshot.data());
              setWeatherLocation(docSnapshot.data().weatherLocation);
            });

            setUserData(userDocSnapshot.data());

            // Recuperer les sessions
            const sessionsQuery = query(
              collection(db, "sessions"),
              where("userId", "==", auth.currentUser.uid)
            );
            const sessionsQuerySnapshot = await getDocs(sessionsQuery);
            const sessionsData = sessionsQuerySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));

            // Recuperer la ville de meteo //
            const getWeatherLocation = userDocSnapshot.data().weatherLocation;
            setWeatherLocation(getWeatherLocation);

            setSessions(sessionsData);

            // Recuperer les taches
            const tasksQuery = query(
              collection(db, "taches"),
              where("userId", "==", auth.currentUser.uid)
            );
            const tasksQuerySnapshot = await getDocs(tasksQuery);
            const tasksData = tasksQuerySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));

            setTasks(tasksData);

            // Recuperer les categories
            const categoriesQuery = query(
              collection(db, "categories"),
              where("userId", "==", auth.currentUser.uid)
            );
            const categoriesQuerySnapshot = await getDocs(categoriesQuery);
            const categoriesData = categoriesQuerySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));

            setCategories(categoriesData);
          } else {
            alert("L'utilisateur n'existe pas...");
          }
        };

        fetchUserData();
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeUserDoc) {
        // Check if defined
        unsubscribeUserDoc();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.currentUser?.uid]);

  // Message de bienvenue à la connexion //
  useEffect(() => {
    if (userData) {
      const existingWelcomeNotif = notifications.find(
        (notification) =>
          notification.type === "notif" &&
          notification.contenu === `Bienvenue ${userData.name}!`
      );

      if (!existingWelcomeNotif) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            contenu: `Bienvenue ${userData.name}!`,
            type: "notif",
          },
        ]);
      }
    }
  }, [userData]);

  // Verifier si des taches sont dûes dans les prochaines 24 heures //
  const checkTaskNotifications = async (tasks) => {
    if (!tasks) {
      return;
    } else {
      const user = auth.currentUser;

      const currentDate = new Date().toISOString();
      const oneDayfromNow = new Date();
      oneDayfromNow.setDate(oneDayfromNow.getDate() + 1);

      const approachingTasks = tasks.filter((task) => {
        const taskDueDate = new Date(task.dateDue);
        console.log("Task Date Due:", task.dateDue);
        return (
          task.userId === user.uid &&
          taskDueDate >= new Date(currentDate) &&
          taskDueDate <= new Date(oneDayfromNow)
        );
      });

      console.log("Current date:", currentDate);
      console.log("One day from now:", oneDayfromNow);
      for (let task of approachingTasks) {
        const existingTaskNotif = notifications.find(
          (notification) =>
            notification.type === "notif" && notification.taskId === task.id
        );
        // Afficher une notification pour prévenir l'utilisateur //
        if (!existingTaskNotif) {
          const newNotification = {
            contenu: `La tache "${task.nom}" est due dans moins de 24 heures!`,
            type: "notif",
            taskId: task.id,
            color: "bg-orange-300",
          };

          setNotifications((prevNotifications) => [
            ...prevNotifications,
            newNotification,
          ]);
        }
      }
    }
  };

  useEffect(() => {
    checkTaskNotifications(tasks);
  }, [tasks]);

  return (
    <div className="w-full h-full rounded-xl flex flex-col p-1 shadow-lg  ">
      <div className="flex  flex-col w-full h-full  p-2 ">
        <NavBar />
        <Notifications
          notifications={notifications}
          setNotifications={setNotifications}
          setSessions={setSessions}
          db={db}
          userData={userData}
          sessionActive={sessionActive}
          setSessionActive={setSessionActive}
          weatherLocation={weatherLocation}
          setWeatherLocation={setWeatherLocation}
        />

        <Routes>
          <Route
            path="/todo"
            element={
              <TodoList
                tasks={tasks}
                setTasks={setTasks}
                newTask={newTask}
                setNewTask={setNewTask}
                categories={categories}
                setCategories={setCategories}
                newCategorie={newCategorie}
                setNewCategorie={setNewCategorie}
                notifications={notifications}
                setNotifications={setNotifications}
                db={db}
                sessionActive={sessionActive}
                setSessionActive={setSessionActive}
              />
            }
          />
          <Route
            path="/statistics"
            element={
              <Statistics
                categories={categories}
                tasks={tasks}
                dateInscription={userData?.dateInscription}
              />
            }
          />
          <Route
            path="/calendrier"
            element={
              <Calendrier
                tasks={tasks}
                categories={categories}
                sessions={sessions}
                setSessions={setSessions}
                db={db}
              />
            }
          />
          <Route
            path="/parametres"
            element={
              <Parametres
                db={db}
                weatherLocation={weatherLocation}
                setWeatherLocation={setWeatherLocation}
                updateWeatherLocationInDb={updateWeatherLocationInDb}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Hub;
