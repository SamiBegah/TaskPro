import { useTimer } from "react-timer-hook";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

function Timer({
  notif,
  setNotifications,
  deleteNotification,
  xBtn,
  startTimer,
  endTimer,
  db,
  sessionActive,
  setSessionActive,
}) {
  const auth = getAuth();

  // GESTION DU MINUTEUR

  const [selectedTime, setSelectedTime] = useState(15 * 60);
  const [sessionId, setSessionId] = useState(null);

  const [startTime, setStartTime] = useState(null);

  const [expiryTimestamp, setExpiryTimestamp] = useState(
    Date.now() + selectedTime * 1000
  );
  const [timerStarted, setTimerStarted] = useState(false);

  const { seconds, minutes, hours, restart, isRunning } = useTimer({
    expiryTimestamp: expiryTimestamp,
    autoStart: false,
  });

  const handleTimeChange = (event) => {
    setSelectedTime(Number(event.target.value) * 60);
  };

  // Commencer le minuteur
  const handleStartClick = async () => {
    if (!timerStarted && sessionActive) {
      const newStartTime = Date.now();
      setStartTime(newStartTime);
      setExpiryTimestamp(newStartTime + selectedTime * 1000);
      restart(newStartTime + selectedTime * 1000);
      setTimerStarted(true);
      // Creer une session et l'enregistrer dans la base de donnees firebase
      try {
        const session = {
          categorie: notif.categorie,
          nom: notif.nom,
          start: serverTimestamp(),
          end: null,
          duration: null,
          userId: auth.currentUser.uid,
        };

        const sessionCollectionRef = collection(db, "sessions");
        const sessionDocRef = await addDoc(sessionCollectionRef, session);

        setSessionId(sessionDocRef.id);
        setExpiryTimestamp(new Date().getTime() + selectedTime * 1000);
        startTimer && startTimer();
      } catch (error) {
        console.error("Erreur debut timer: ", error);
      }
    }
  };

  // Arreter le minuteur
  const handleStopClick = async () => {
    if (timerStarted) {
      setTimerStarted(false);
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - startTime) / 1000 / 60); // Duree en minutes
      try {
        const sessionDocRef = doc(db, "sessions", sessionId);
        // Supprimer la session si elle a durée moins d'une minute
        if (duration < 1) {
          await deleteDoc(sessionDocRef);
        } else {
          // Sinon, mettre a jour la session
          await updateDoc(sessionDocRef, {
            end: endTime,
            duration: duration,
          });
        }
        deleteNotification(notif);

        // Afficher le nombre de minutes enregistrées ou notif d'annulation si < 1 min //
        const newNotification =
          duration < 1
            ? {
                contenu: `Séance annulée (moins d'une minute enregistrée)`,
                type: "notif",
                color: "bg-red-300",
              }
            : {
                contenu: `${duration} minutes enregistrées pour "${notif.nom}"`,
                type: "notif",
                color: "bg-green-300",
              };

        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);
        endTimer && endTimer();
        setStartTime(null);
        setSessionActive(false);
      } catch (error) {
        console.error("Erreur fin timer: ", error);
      }
    }
  };

  return (
    <div
      className={`h-24 w-60 rounded-xl bg-white shadow-sm border border-slate-200 flex flex-col text-black p-2`}
    >
      <div className="relative flex flex-col h-full w-full items-center justify-center gap-1">
        <h2 className="text-center text-sm ">{notif.categorie} </h2>
        <p className="text-sm text-center"> {notif.nom}</p>
        {!isRunning && (
          <button
            className="shadow-xl"
            onClick={() => {
              deleteNotification(notif);
              setSessionActive(false);
            }}
          >
            <img
              src={xBtn}
              alt="Delete button"
              className="absolute -top-1 w-4 -right-1 bg-white rounded-full opacity-25 hover:opacity-100"
            />
          </button>
        )}
      </div>
      {/* Formulaire de choix du temps de la séance */}
      <form className="flex flex-col gap-2">
        <div className="flex">
          <div className="flex flex-col justify-center items-center text-md text-cyan-950 w-full ">
            <div className="flex items-center gap-2">
              {!isRunning && (
                <div>
                  <select
                    onChange={handleTimeChange}
                    className="rounded-xl outline-none p-1 w-24"
                  >
                    <option value="15">15 mins</option>
                    <option value="30">30 mins</option>
                    <option value="60">60 mins</option>
                    <option value="90">90 mins</option>
                  </select>
                </div>
              )}
              {/* Affichage du minuteur */}
              {isRunning && (
                <div className="bg-white rounded-xl outline-none text-center p-1">
                  <span>{hours}</span>:<span>{Math.floor(minutes % 60)}</span>:
                  <span>{Math.floor(seconds % 60)}</span>
                </div>
              )}

              {/* Gestion des boutons commencer/terminer du minuteur */}
              {!isRunning && (
                <button
                  className="relative h-8 inline-flex items-center justify-start inline-block px-5 py-1 overflow-hidden font-medium transition-all bg-blue-custom rounded-lg hover:bg-white group"
                  onClick={handleStartClick}
                  disabled={isRunning || timerStarted}
                >
                  <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
                  <span className="text-sm relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-blue-custom">
                    Commencer
                  </span>
                </button>
              )}

              {isRunning && (
                <button
                  type="button"
                  onClick={handleStopClick}
                  className="relative h-8 inline-flex items-center justify-start inline-block px-5 py-1 overflow-hidden font-medium transition-all bg-blue-custom rounded-lg hover:bg-white group"
                >
                  <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
                  <span className="text-sm relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-blue-custom">
                    Terminer
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Timer;
