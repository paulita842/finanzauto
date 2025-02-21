import React, { useState, useEffect } from "react";
import {
  AiFillEye,
  AiFillEdit,
  AiFillDelete,
  AiOutlineUserAdd,
} from "react-icons/ai";

const UserRegistration = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [newUser, setNewUser] = useState({
    title: "mr",
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
  });

  //Datos para el consumo de la API
  const API_URL = "https://dummyapi.io/data/v1";
  const APP_ID = "63473330c1927d386ca6a3a5";

  useEffect(() => {
    fetchUsers();
  }, []);

  //aca realizo el llamado a la API
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/user?page=1&limit=10`, {
        method: "GET",
        headers: { "app-id": APP_ID },
      });

      const data = await response.json();
      console.log("Consulta paula", data);
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const handleAction = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
    setErrorMessage("");

    if (type === "create") {
      setNewUser({
        title: "mr",
        firstName: "",
        lastName: "",
        email: "",
        picture: "",
      });
    } else if (type === "edit") {
      setNewUser({
        title: user.title || "mr",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || "",
        picture: user.picture,
      });
    }
  };
  //Funcion para eliminar usuario seleccionado
  const handleDelete = (user) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${user.firstName}?`)) {
      alert(`Usuario ${user.firstName} eliminado`);
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  //funcion para crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // funcion para hacer validacion si el correo existe o no
    const emailExists = users.some((user) => user.email === newUser.email);
    if (emailExists) {
      setErrorMessage("El email ya está en uso. Intenta con otro.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/create`, {
        method: "POST",
        headers: {
          "app-id": APP_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers([data, ...users]);

        setShowModal(false);
      } else {
        setErrorMessage(`Error al crear usuario: ${data.error}`);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setErrorMessage(
        "Hubo un problema al crear el usuario. Intenta de nuevo."
      );
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-4xl font-extrabold text-[#216e6a] text-center mb-8">
        MODULO DE CONSULTA Y REGISTRO DE USUARIO FINANZAUTO
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-1/3"
        />
        <button
          onClick={() => handleAction("create")}
          className="mt-2 sm:mt-0 bg-[#216e6a] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <AiOutlineUserAdd /> Crear Usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nombre y Apellido</th>
              <th className="border p-2">Foto</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) =>
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">{user.id}</td>
                  <td className="border p-2 text-center">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="border p-2 flex justify-center">
                    <img
                      src={user.picture}
                      alt="Foto"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleAction("view", user)}
                        className="bg-blue-500 text-white p-2 rounded text-sm flex items-center gap-1"
                      >
                        <AiFillEye /> Ver
                      </button>
                      <button
                        onClick={() => handleAction("edit", user)}
                        className="bg-yellow-500 text-white p-2 rounded text-sm flex items-center gap-1"
                      >
                        <AiFillEdit /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="bg-red-500 text-white p-2 rounded text-sm flex items-center gap-1"
                      >
                        <AiFillDelete /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "create"
                ? "Crear Usuario"
                : modalType === "edit"
                ? "Editar Usuario"
                : "Detalles del Usuario"}
            </h2>

            {modalType === "create" && (
              <form onSubmit={handleCreateUser}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nombre"
                  className="border p-2 w-full mb-2"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  className="border p-2 w-full mb-2"
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border p-2 w-full mb-2"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="picture"
                  placeholder="URL de la foto"
                  className="border p-2 w-full mb-2"
                  onChange={handleChange}
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
                >
                  Crear
                </button>
              </form>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md w-full mt-3"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "edit" ? "Editar Usuario" : "Detalles del Usuario"}
            </h2>

            <p>
              <strong>Nombre:</strong> {selectedUser.firstName}
            </p>
            <p>
              <strong>Apellido:</strong> {selectedUser.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email || "N/A"}
            </p>
            <img
              src={selectedUser.picture}
              alt="Foto"
              className="w-16 h-16 rounded-full mt-2"
            />

            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md w-full mt-3"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRegistration;
