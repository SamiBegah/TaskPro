import { useState } from "react";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

function Parametres() {
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

  return (
    <section className="flex-1 w-full space-y-2 h-full">
      <div className="flex flex-col gap-2 w-full h-full p-1">
        <div className="relative flex flex-col border border-gray-200 bg-white rounded-lg w-full h-full p-3  gap-2">
          <h1 className="text-xl font-bold p-2"> Parametres </h1>

          <div className="w-full h-4/6 p-2 py-2">
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleModalOpen}
            >
              Supprimer mon compte
            </button>
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
        </div>
      </div>
    </section>
  );
}

export default Parametres;
