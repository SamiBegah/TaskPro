import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

// Gestion du calendrier avec react-big-calendar
function Calendrier({ tasks, categories, sessions }) {
  const events = tasks.map((task) => {
    const taskCategory = categories.find(
      (category) => category.nom === task.categorie
    );

    return {
      start: moment(task.dateDue).toDate(),
      end: moment(task.dateDue).add(1, "hours").toDate(),
      title: task.nom,
      color: taskCategory ? taskCategory.color : null,
    };
  });

  // Recuperation des couleurs des categories des sessions
  const sessionEvents = sessions.map((session) => {
    const sessionCategory = categories.find(
      (category) => category.nom === session.categorie
    );
    const sessionColor = sessionCategory ? sessionCategory.color : null;

    if (!session.start || !session.end) {
      return null;
    }
    // Debut et fin des sessions
    const startTime = session.start.toDate();
    const endTime = session.end.toDate();

    const title = `${session.categorie} : ${moment(startTime).format(
      "hh:mm A"
    )} - ${moment(endTime).format("hh:mm A")} (${session.duration} minutes)`;

    return {
      start: startTime,
      end: endTime,
      title: title,
      color: sessionColor,
    };
  });

  const allEvents = [...events, ...sessionEvents];

  return (
    <section className="flex-1 w-full h-full overflow-y-auto ">
      <div className="flex flex-col gap-2 w-full h-full p-1">
        <div className="relative flex flex-col h-screen border border-gray-200 bg-white rounded-lg w-full  p-5 gap-2">
          <h1 className="text-xl font-bold p-2"> Calendrier </h1>
          <div className="w-full h-full bg-white rounded-xl p-2 py-2 text-sm">
            {/* Affichage du calendrier avec les sessions et taches dues */}
            <Calendar
              localizer={localizer}
              events={allEvents}
              startAccessor="start"
              endAccessor="end"
              className="text-lg p-2"
              eventPropGetter={(event) => {
                return {
                  className: "text-lg",
                  style: { backgroundColor: event.color }, // utilisation des couleurs des categories
                };
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Calendrier;
