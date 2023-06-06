function Connexion() {
  return (
    <div className="m-5 rounded-xl flex flex-col justify-center w-5/12 bg-white px-10 py-10 shadow-sm">
      <p className="text-xl text-center">
        Bienvenue sur <span className="text-cyan-500">TaskPro</span> !
      </p>
      <br />
      <br />
      <form className="flex flex-col gap-10">
        <div className="flex flex-col">
          <label className="text-gray-500"> Courriel </label>
          <input className="py-2 border-b-2"></input>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-500"> Mot de passe </label>
          <input className="py-2 border-b-2"></input>
        </div>
      </form>

      <p
        className="text-xs text-right text-gray-700 mt-3
      "
      >
        Mot de passe <span className="font-bold"> oublié?</span>
      </p>
      <br />

      <a
        href="/hub/todo"
        className="font-bold rounded-full bg-cyan-950 text-white p-2 text-center"
      >
        Se connecter
      </a>
      <br />
      <div className="flex justify-center items-center">
        <div className="border-b w-1/2"></div>
        <span className="px-2 text-sm text-gray-400"> ou </span>
        <div className="border-b w-1/2"></div>
      </div>
      <br />
      <button className="font-bold border-2 rounded-full p-2">
        Créer un nouveau compte
      </button>
    </div>
  );
}

export default Connexion;
