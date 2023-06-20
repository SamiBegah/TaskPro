import { useState, useEffect } from "react";
import xBtn from "../img/xBtn.png";
import Timer from "./Timer";

function SideBar({
  notifications,
  setNotifications,
  categories,
  setCategories,
  setSessions,
  timerId,
  db,
  sessionActive,
  setSessionActive,
}) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null);

  const startTimer = (timerId) => {
    setActiveTimer(timerId);
    setSessionActive(true);
    setIsTimerRunning(true);
  };

  const endTimer = () => {
    setActiveTimer(null);
    setSessionActive(false);
    setIsTimerRunning(false);
  };

  // GESTION DES NOTIFICATIONS
  const deleteNotification = (notif) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((thisNotification) => thisNotification !== notif)
    );
  };

  const updateNotifications = (oldNotification, newNotification) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif === oldNotification ? newNotification : notif
      )
    );
  };

  // API METEO OPENWEATHERMAP
  const [weatherData, setWeatherData] = useState(null);

  const getWeatherData = async (latitude, longitude) => {
    const apiKey = "4301ff94eb15a4ed9aa1bf9e759ce8fd";
    let url;
    if (latitude && longitude) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    } else {
      const newYorkLatitude = 40.7128;
      const newYorkLongitude = -74.006;
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${newYorkLatitude}&lon=${newYorkLongitude}&appid=${apiKey}&units=metric`;
    }
    const response = await fetch(url);
    const data = await response.json();
    const cityName = data.name || "New York";
    const icon = data.weather[0].icon;
    setWeatherData({ ...data, icon, cityName });
  };

  // Recuperer la localisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherData(latitude, longitude);
        },
        (error) => {
          getWeatherData("New York"); // localisation par default si utilisateur refuse de partager ses coordonnees
        }
      );
    }
  }, []);

  return (
    <section className="relative rounded-b-xl flex px-3">
      <div className="flex h-24 ">
        <div className="h-24 w-44 absolute right-3 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col items-center justify-around p-1 gap-1">
          <div className="flex p-2 ">
            <div className="w-2/3">
              <h2 className="text-center text-base">
                {weatherData && weatherData.cityName}
              </h2>
              <p className="text-sm">
                {" "}
                {weatherData && weatherData.main && weatherData.main.temp} °C
              </p>
            </div>
            {weatherData && weatherData.icon && (
              <img
                className=""
                src={`http://openweathermap.org/img/w/${weatherData.icon}.png`}
                alt="Weather Icon"
              />
            )}
          </div>
        </div>

        {/* Affichage des notifications */}
        <ul className="flex flex-wrap gap-2 max-w-3/4">
          {notifications.map((notif, index) => {
            if (notif.type !== "timer") {
              return (
                <li
                  key={index}
                  className={`h-24 w-60 transition-all duration-200 ease-in-out rounded-2xl ${
                    notif.color ? notif.color : "bg-white"
                  } shadow-sm border border-slate-200 flex flex-col items-center justify-around p-1 gap-1`}
                >
                  <div className="relative flex justify-between items-center w-full h-full gap-2">
                    <p className="text-center text-sm flex-grow">
                      {notif.contenu}
                    </p>
                    <button
                      className="shadow-xl"
                      onClick={() => deleteNotification(notif)}
                    >
                      <img
                        src={xBtn}
                        alt="Delete button"
                        className="absolute top-1 w-4 right-1 bg-white rounded-full opacity-25 hover:opacity-100"
                      />
                    </button>
                  </div>
                  {/* Option de retour en arriere */}
                  {notif.undo && (
                    <button
                      className="flex justify-center items-center h-8 w-32 gap-2 bg-gradient rounded-full shadow-md text-white"
                      onClick={() => {
                        notif.undo();
                        deleteNotification(notif);
                      }}
                    >
                      Annuler
                    </button>
                  )}
                </li>
              );
            } else {
              return (
                <Timer
                  key={notif.id}
                  notif={notif}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  categories={categories}
                  setCategories={setCategories}
                  deleteNotification={deleteNotification}
                  setSessions={setSessions}
                  xBtn={xBtn}
                  db={db}
                  startTimer={() => startTimer(notif.id)}
                  endTimer={endTimer}
                  isTimerRunning={isTimerRunning}
                  setSessionActive={setSessionActive}
                  sessionActive={sessionActive}
                  updateNotifications={updateNotifications}
                />
              );
            }
          })}
        </ul>
      </div>
    </section>
  );
}

export default SideBar;
