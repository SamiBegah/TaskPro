import { useTimer } from "react-timer-hook";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import TimerIcon from "../img/timer.png";

function Timer({
  notif,
  notifications,
  setNotifications,
  deleteNotification,
  xBtn,
  startTimer,
  endTimer,
  db,
  sessionActive,
  setSessionActive,
  timerId,
  updateNotifications,
}) {
  const auth = getAuth();

  const [selectedTime, setSelectedTime] = useState(30 * 60);
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

  // GESTION DU MINUTEUR

  const handleTimerClick = async () => {
    if (!timerStarted && sessionActive) {
      const newStartTime = Date.now();
      setStartTime(newStartTime); // store the start time
      setExpiryTimestamp(newStartTime + selectedTime * 1000);
      restart(newStartTime + selectedTime * 1000);
      setTimerStarted(true);
      try {
        const session = {
          categorie: notif.categorie,
          nom: notif.nom,
          start: serverTimestamp(),
          end: null,
          duration: null,
          userId: auth.currentUser.uid, // assuming you have auth setup
        };

        const sessionCollectionRef = collection(db, "sessions");
        const sessionDocRef = await addDoc(sessionCollectionRef, session);

        setSessionId(sessionDocRef.id);
        setExpiryTimestamp(new Date().getTime() + selectedTime * 1000);
        startTimer && startTimer();
      } catch (error) {
        console.error("Error starting timer: ", error);
      }
    }
  };

  const handleStopClick = async () => {
    if (timerStarted) {
      setTimerStarted(false);
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - startTime) / 1000 / 60); // Duree en minutes
      try {
        const sessionDocRef = doc(db, "sessions", sessionId);

        if (duration < 1) {
          await deleteDoc(sessionDocRef);
        } else {
          await updateDoc(sessionDocRef, {
            end: endTime,
            duration: duration,
          });
        }

        deleteNotification(notif);
        // Afficher le nombre de minutes enregistrées ou annuler si < 1 min //
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
        console.error("Error ending timer: ", error);
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
            onClick={() => deleteNotification(notif)}
          >
            <img
              src={xBtn}
              alt="Delete button"
              className="absolute -top-1 w-4 -right-1 bg-white rounded-full opacity-25 hover:opacity-100"
            />
          </button>
        )}
      </div>

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
                    <option value="30" selected>
                      30 mins
                    </option>
                    <option value="60">60 mins</option>
                    <option value="90">90 mins</option>
                  </select>
                </div>
              )}

              {isRunning && (
                <div className="bg-white rounded-xl outline-none text-center p-1">
                  <span>{hours}</span>:<span>{Math.floor(minutes % 60)}</span>:
                  <span>{Math.floor(seconds % 60)}</span>
                </div>
              )}

              {!isRunning && (
                <button
                  className="relative h-8 inline-flex items-center justify-start inline-block px-5 py-1 overflow-hidden font-medium transition-all bg-blue-custom rounded-lg hover:bg-white group"
                  onClick={handleTimerClick}
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
