import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
const API_URL = `${import.meta.env.VITE_API_URL}`;

function Login({ setIsLoggedIn, setUserData }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginFailed, setIsLoginFailed] = useState(false);

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
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        setUserData(data.user);

        setIsLoggedIn(!!data.accessToken);

        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setIsLoginFailed(true);
      });
  };

  return (
    <>
      <div className="loginWrapper">
        <div className="loginCard">
          <h1>Sign in with email</h1>
          <p id="loginDescription">
            Book appointments and manage your visits in one simple, convenient
            place. For free.
          </p>

          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="login-inputs-wrapper">
              <div className="form-group">
                <input
                  id="login-email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="login-email">Email</label>
              </div>
              <div className="form-group">
                <input
                  id="login-password"
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="login-password">Password</label>
              </div>
            </div>

            <p id="forgotPassword">Forgot password?</p>
            <button id="login-submit" type="submit">
              Sign in
            </button>
            {isLoginFailed && (
              <div id="login-failed">
                <p>Incorrect login or password</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
