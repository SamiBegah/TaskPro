import Logo from "../img/logo.png";

function Accueil() {
  return (
    <div className="m-5 rounded-xl flex flex-col justify-center w-5/12 bg-white opacity-90 px-10 py-10 shadow-sm gap-10">
      <img
        className="w-1/2 self-center animate-spin
      "
        src={Logo}
        alt="TaskPro logo"
        style={{ animationDuration: "10000ms" }}
      />
      {/*<a href="https://www.flaticon.com/free-icons/icosahedron" title="icosahedron icons">Icosahedron icons created by Freepik - Flaticon</a>*/}
      <h1 className="text-7xl text-cyan-600 text-center font-Montserrat">
        {" "}
        TaskPro
      </h1>

      <p className=" text-md text-center line leading-7">
        {" "}
        Organisez, accomplissez et faites le suivi de vos{" "}
        <span className="font-bold text-cyan-500">tâches</span> comme un{" "}
        <span className="font-bold text-cyan-500">pro</span>, dans une seule
        plateforme qui regroupe tout pour vous !
      </p>
    </div>
  );
}

export default Accueil;
