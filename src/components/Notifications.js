import { useState, useEffect } from "react";
import xBtn from "../img/xBtn.png";
import Timer from "./Timer";

function Notifications({
  notifications,
  setNotifications,
  categories,
  setCategories,
  setSessions,
  db,
  sessionActive,
  setSessionActive,
  weatherLocation,
}) {
  // GESTION DU TIMER
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Debut d'une seance
  const startTimer = () => {
    setSessionActive(true);
    setIsTimerRunning(true);
  };

  // Fin d'une seance
  const endTimer = () => {
    setSessionActive(false);
    setIsTimerRunning(false);
  };

  // Supprimer une notification
  const deleteNotification = (notif) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((thisNotification) => thisNotification !== notif)
    );
  };

  // GESTION DE L'API METEO OPENWEATHERMAP
  const [weatherData, setWeatherData] = useState(null);

  // Recuperation et affichage de la meteo
  useEffect(() => {
    const getWeatherData = async (latitude, longitude) => {
      const apiKey = "4301ff94eb15a4ed9aa1bf9e759ce8fd";
      let url;
      if (latitude && longitude) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      } else {
        const location = weatherLocation || "";
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          location
        )}&appid=${apiKey}&units=metric`;
      }
      // Appelle a l'api OpenWeatherMap
      try {
        const response = await fetch(url);
        const data = await response.json();

        const cityName = data.name || weatherLocation;
        const icon = data.weather[0].icon;
        setWeatherData({ ...data, icon, cityName });
      } catch (error) {
        console.error("Weather API Error:", error);
      }
    };
    // Si l'utilisateur accepte de partager sa localisation, afficher meteo ville locale
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherData(latitude, longitude);
        },
        (error) => {
          getWeatherData();
        }
      );
    } else {
      getWeatherData();
    }
  }, [weatherLocation || ""]);

  return (
    <section className="relative rounded-b-xl flex px-3 ">
      <div className="flex h-24 ">
        {/* Affichage de la meteo */}
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
                  className={`h-24 w-60  shadow-md transition-all duration-200 ease-in-out rounded-2xl ${
                    notif.color ? notif.color : "bg-white"
                  } border border-slate-200 flex flex-col items-center justify-around p-1 gap-1`}
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
                      className="relative h-8 inline-flex items-center justify-start inline-block px-5 py-1 overflow-hidden font-medium transition-all bg-blue-custom rounded-lg hover:bg-white group"
                      onClick={() => {
                        notif.undo();
                        deleteNotification(notif);
                      }}
                    >
                      <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
                      <span className="text-sm relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-blue-custom">
                        Annuler
                      </span>
                    </button>
                  )}
                </li>
              );
            } else {
              return (
                // Affichage des notifications de minuteur pour les seances
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
                />
              );
            }
          })}
        </ul>
      </div>
    </section>
  );
}

export default Notifications;
