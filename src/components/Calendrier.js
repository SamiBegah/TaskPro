import { Calendar, momentLocalizer } from "react-big-calendar";
import { getDocs, collection } from "firebase/firestore";
import { useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

function Calendrier({ tasks, categories, sessions, db, setSessions }) {
  const events = tasks.map((task) => {
    const taskCategory = categories.find(
      (category) => category.nom === task.categorie
    );

    return {
      start: moment(task.dateDue).toDate(),
      end: moment(task.dateDue).add(1, "hours").toDate(),
      title: task.nom,
      color: taskCategory ? taskCategory.color : null, // Use the color of the category if found, otherwise use null
    };
  });

  useEffect(() => {
    const fetchSessions = async () => {
      const sessionCollectionRef = collection(db, "sessions");
      const sessionSnapshot = await getDocs(sessionCollectionRef);
      const sessionList = sessionSnapshot.docs.map((doc) => doc.data());
      setSessions(sessionList);
    };

    fetchSessions();
  }, [db, setSessions]);

  const sessionEvents = sessions.map((session) => {
    const sessionCategory = categories.find(
      (category) => category.nom === session.categorie
    );
    const sessionColor = sessionCategory ? sessionCategory.color : null; // Use the color of the category if found, otherwise use null

    if (!session.start || !session.end) {
      return null; // return null or some default value
    }

    const startTime = moment(session.start.toDate()).format("hh:mm A");
    const endTime = moment(session.end.toDate()).format("hh:mm A");

    const title = `${session.categorie} : ${startTime} - ${endTime} (${session.duration} minutes)`;

    return {
      start: session.start.toDate(),
      end: session.end.toDate(),
      title: title,
      color: sessionColor,
    };
  });

  const allEvents = [...events, ...sessionEvents];

  return (
    <section className="flex-1 w-full space-y-2 h-full">
      <div className="flex flex-col gap-2 w-full h-full p-1">
        <div className="relative flex flex-col border border-gray-200 bg-white rounded-lg w-full h-full p-3 gap-2">
          <h1 className="text-xl font-bold p-2"> Calendrier </h1>
          <div className="w-full h-full bg-white rounded-xl p-2 py-2 text-sm">
            <Calendar
              localizer={localizer}
              events={allEvents}
              startAccessor="start"
              endAccessor="end"
              className="text-lg p-2"
              eventPropGetter={(event) => {
                return {
                  className: "text-lg",
                  style: { backgroundColor: event.color }, // Set the background color of the event based on the color property
                };
              }}
              dayPropGetter={(date) => {
                return {
                  className: "text-lg wrap w-3/4",
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
