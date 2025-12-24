import { useEffect, useState } from "react";
import "./Users.css";
import { authFetch } from "../../api/authFetch";

function Users({ users, setUsers }) {
  const [newUserName, setNewUserName] = useState("");

  const [apiUsers, setApiUsers] = useState([]);
  useEffect(() => {
    authFetch(`/users/users`, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            console.error("Fetch error:", text);
            throw new Error("Fetch failed: " + res.status);
          });
        }
        return res.json();
      })
      .then((data) => setApiUsers(data))
      .catch((err) => console.error("Users fetch error:", err));
  }, []);

  function addUser() {
    if (!newUserName) return;

    const newUser = { id: users.length + 1, name: newUserName };
    setUsers([...users, newUser]);
    setNewUserName("");

    console.log(users);
  }

  function writeUsersToConsole() {
    console.log(apiUsers);
  }

  return (
    <>
      <div className="card">
        <h3>Dodaj użytkownika:</h3>
        <label htmlFor="newUserName">Imię użytkownika:</label>
        <input
          id="newUserName"
          type="text"
          placeholder="Wpisz imię"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button onClick={addUser}>Dodaj!</button>
      </div>
      <div className="card">
        <h3>Lista użytkowników:</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Lista użytkowników z fetcha:</h3>
        <ul className="fetchListUl">
          {apiUsers.map((user) => (
            <li className="fetchListLi" key={user.id}>
              Imię: {user.firstName}
              <br /> adres e-mail: {user.email}
            </li>
          ))}
        </ul>
        <button onClick={writeUsersToConsole}>
          Wypisz do konsoli userów z fetch'a
        </button>
      </div>
    </>
  );
}

export default Users;
