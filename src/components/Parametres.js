import { useState } from "react";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

function Parametres({
  weatherLocation,
  setWeatherLocation,
  updateWeatherLocationInDb,
}) {
  const auth = getAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // GESTION DE LA SUPPRESSION DE COMPTE
  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, password);

      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);

      window.location.href = "/";
    } catch (error) {
      setError("Mauvais mot de passe.");
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPassword("");
    setError("");
  };

  const handleConfirmDelete = () => {
    if (password.trim() !== "") {
      handleDeleteAccount();
    } else {
      setError("Veuillez entre votre mot de passe.");
    }
  };

  // GESTION DE VILLE DE L'API METEO
  const [newWeatherLocation, setNewWeatherLocation] = useState(
    weatherLocation || "New York"
  );
  const [cityError, setCityError] = useState(false);

  const handleWeatherLocationChange = async (e) => {
    e.preventDefault();
    try {
      const newLocation = newWeatherLocation;
      // Si la ville est valide, changer la ville affichée par l'api meteo
      const isValidCity = await validateCity(newLocation);
      if (isValidCity) {
        setCityError(false);
        await updateWeatherLocationInDb(newLocation);
        setWeatherLocation(newLocation);
      } else {
        setCityError(true);
      }
    } catch (error) {
      setCityError(true);
    }
  };

  // Verifier si l'utilisateur entre une ville valide
  const validateCity = async (city) => {
    const apiKey = "4301ff94eb15a4ed9aa1bf9e759ce8fd";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === 200) {
        return true; // La ville existe
      }
      alert("Cette ville n'existe pas!");
      return false;
      // La ville n'existe pas
    } catch (error) {
      return false;
    }
  };

  return (
    <section className="flex-1 w-full space-y-2 h-full">
      <div className="flex flex-col gap-2 w-full h-full p-1">
        <div className="relative flex flex-col border border-gray-200 bg-white rounded-lg w-full h-full p-5  gap-2">
          <h1 className="text-xl font-bold p-2"> Parametres </h1>
          {/* Formulaire de changement de ville */}
          <form
            onSubmit={handleWeatherLocationChange}
            className="flex flex-col p-5 gap-3"
          >
            <span>Votre ville:</span>
            <input
              value={newWeatherLocation}
              onChange={(e) => setNewWeatherLocation(e.target.value)}
              className="w-60 text-center border border-blue-500 p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 w-60 text-white font-bold py-2 px-4 rounded"
            >
              Changer la ville
            </button>
            {cityError && (
              <p className="text-red-500 mt-2">Cette ville n'existe pas.</p>
            )}
            <br />
          </form>
          <div className=" h-4/6 flex flex-col p-5  py-2">
            {/* Boutton de suppression de compte */}
            <span>Gestion du compte :</span>
            <button
              className="bg-red-500 w-60 text-white font-bold py-2 rounded mt-4 "
              onClick={handleModalOpen}
            >
              Supprimer mon compte
            </button>

            {/* Apparition d'un modal pour confirmer la suppresion de compte de l'utilisateur avec son mot de passe */}
            {showModal && (
              <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-4">
                  <h2 className="text-xl font-bold mb-2">Êtes-vous sûr?</h2>
                  <div>
                    <label
                      htmlFor="password"
                      className="block font-bold text-gray-700"
                    >
                      Entrez votre mot de passe
                    </label>

                    <input
                      type="password"
                      id="password"
                      className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={handleModalClose}
                    >
                      Annuler
                    </button>
                    <button
                      className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                      onClick={handleConfirmDelete}
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <i className="text-xs text-right">
            Credits: les icones utilisées sur ce site proviennent de Icons8.com
          </i>
        </div>
      </div>
    </section>
  );
}

export default Parametres;
