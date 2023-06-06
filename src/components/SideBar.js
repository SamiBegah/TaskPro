import { useState, useEffect } from "react";

import Timer from "./Timer";

function SideBar() {
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherData(latitude, longitude);
        },
        (error) => {
          getWeatherData("New York");
        }
      );
    }
  }, []);

  return (
    <section className="w-44 bg-cyan-500 bg-opacity-20 py-5 p-3 rounded-r-xl flex flex-col items-center gap-5">
      <h2>
        Bienvenue <span className="font-bold">Nom</span>,
      </h2>
      <div className=" w-36 h-32 rounded-2xl bg-white shadow-xl flex flex-col items-center justify-center pt-2">
        {weatherData && weatherData.main && weatherData.icon && (
          <>
            <h2 className="text-center">{weatherData.cityName}</h2>
            <p className="text-sm"> {weatherData.main.temp} °C</p>
            <img
              className="w-16"
              src={`http://openweathermap.org/img/w/${weatherData.icon}.png`}
              alt="Weather Icon"
            />
          </>
        )}
      </div>
      <div className="w-36 h-36 rounded-2xl bg-cyan-950 shadow-xl flex flex-col items-center py-3 text-white gap-3">
        <h2>Tutoriel</h2>
        <p className="text-sm">"Exemple de Tache"</p>
        <form className="flex flex-col gap-2">
          <div className="flex gap-2 justify-center">
            <Timer categorie="" />
          </div>
        </form>
      </div>
    </section>
  );
}

export default SideBar;
