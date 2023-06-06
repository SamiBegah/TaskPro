import { useTimer } from "react-timer-hook";
import TimerIcon from "../img/timer.png";
import { useState } from "react";

function Timer() {
  const [selectedTime, setSelectedTime] = useState(30 * 60);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const { seconds, minutes, hours, restart, isRunning } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
  });

  const handleTimeChange = (event) => {
    setSelectedTime(Number(event.target.value) * 60);
  };

  const startTimer = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + selectedTime);
    restart(time);
    setStartTimestamp(Date.now());
  };

  const endTimer = () => {
    const timeElapsed = (Date.now() - startTimestamp) / 1000; // convert milliseconds to seconds
    setElapsedTime(timeElapsed);
    const time = new Date();
    restart(time);
  };

  return (
    <div className="flex flex-col justify-center items-center text-sm text-cyan-950">
      <div className="flex items-center gap-2 justify-center">
        {!isRunning && (
          <select
            onChange={handleTimeChange}
            className="rounded-xl outline-none w-2/3 text-center p-1"
            defaultValue="30"
          >
            <option value="15">15 mins</option>
            <option value="30">30 mins</option>
            <option value="60">1 hour</option>
            <option value="90">1 hour 30 mins</option>
          </select>
        )}

        {isRunning && (
          <div className="bg-white shadow-sm rounded-xl py-1 px-2 text-cyan-950 text-lg outline-none w-2/3 text-center p-1">
            <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
          </div>
        )}

        <button type="button" onClick={isRunning ? endTimer : startTimer}>
          <img
            className="w-8"
            src={TimerIcon}
            alt={isRunning ? "End timer" : "Start timer"}
          />
        </button>
      </div>

      {!isRunning && startTimestamp && (
        <div className="flex p-2">
          {elapsedTime / 60 > 1 ? (
            <p className="text-white">
              {Math.floor(elapsedTime / 60)} minute(s) enregistrées!
            </p>
          ) : (
            <p className="text-white fade-out"> Minuteur annulé... </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Timer;
