import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";

function Statistics({ categories, tasks, dateInscription }) {
  const formattedDate = dateInscription.toDate().toLocaleDateString();

  const renderLabel = (props) => {
    const { x, y, width, height, value } = props;
    return (
      <text x={x + width + 5} y={y + height / 2 + 10} fill="#2B505E" dy={-6}>
        {`${(value / 60).toFixed(2)} hrs`}
      </text>
    );
  };

  const maxTempsEffectue =
    Math.max(...categories.map((categorie) => categorie.tempsEffectue)) + 1000;

  // Affichage des détails lors du survol des statistiques
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white px-2 py-1 rounded-xl shadow-lg">
          <p className="label">{`${payload[0].payload.nom} : ${payload[0].value} minutes au total depuis le ${payload[0].payload.date}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="flex-1 w-full space-y-2 h-full">
      <div className="flex flex-col gap-2 w-full h-full p-1  ">
        <div className="relative flex flex-col border border-gray-200 bg-white rounded-lg w-full h-full p-3  gap-2">
          <h1 className="text-xl font-bold p-2"> Statistiques </h1>
          <div className="flex flex-col  gap-2 p-2">
            <h2>
              {" "}
              Depuis votre inscription le {formattedDate}, vous avez cumulé:{" "}
            </h2>

            <span>
              <span className="font-bold text-lg">
                {(
                  categories.reduce(
                    (total, categorie) => total + categorie.tempsEffectue,
                    0
                  ) / 60
                ).toFixed(2)}
                &nbsp;heures
              </span>
              &nbsp;de productivité,
            </span>

            <span>
              <span className="font-bold text-lg">
                {categories.length} catégories
              </span>
              &nbsp;de tâches,
            </span>
            <span>
              <span className="font-bold text-lg">
                {categories.reduce(
                  (total, categorie) => total + categorie.tachesCompletes,
                  0
                )}
                &nbsp; et tâches
              </span>
              &nbsp;accomplies!
            </span>
          </div>
          <div className="w-full h-full p-10">
            <ResponsiveContainer width="80%" height="50%">
              <BarChart
                width={500}
                height={300}
                data={categories}
                layout="vertical"
                margin={{ top: 15, right: 50, left: 30, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  dataKey="tempsEffectue"
                  domain={[0, maxTempsEffectue]}
                  hide
                />
                <YAxis
                  type="category"
                  dataKey="nom"
                  axisLine={false}
                  dx={-5}
                  tickLine={false}
                  style={{ fill: "#2B505E" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tempsEffectue" background={{ fill: "#eee" }}>
                  {categories.map((category, index) => (
                    <Cell key={`cell-${index}`} fill={category.color} />
                  ))}
                  <LabelList
                    dataKey="tempsEffectue"
                    content={renderLabel}
                    position="outsideRight"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Statistics;
