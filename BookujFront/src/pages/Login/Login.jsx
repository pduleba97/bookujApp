import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
const API_URL = `${import.meta.env.VITE_API_URL}`;

function Login({ setIsLoggedIn, setUserData }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Login failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Logged in:", data);

        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        setUserData(data.user);

        setIsLoggedIn(!!data.accessToken);

        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="loginWrapper">
        <div className="loginCard">
          <h2>Sign in with email</h2>
          <p id="loginDescription">
            Book appointments and manage your visits in one simple, convenient
            place. For free.
          </p>

          <form className="loginForm" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p id="forgotPassword">Forgot password?</p>
            <button type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
