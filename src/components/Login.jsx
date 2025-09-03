import React, { useState } from "react";
import { authAPI } from "../api";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await authAPI.register(formData);
        setIsRegister(false);
        setError("Registration successful! Please login.");
      } else {
        const response = await authAPI.login(
          formData.username,
          formData.password
        );
        localStorage.setItem("token", response.data.access_token);
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
      console.log("The Error is:", err)
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      {error && <div style={{ color: "red" }}>Error Happened</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        {isRegister && (
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <button
          type="submit"
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p>
        {isRegister ? "Already have an account?" : "Don't have an account?"}
        <button
          onClick={() => setIsRegister(!isRegister)}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
          }}
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default Login;
